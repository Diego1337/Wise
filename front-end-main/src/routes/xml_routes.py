from flask import Blueprint, request, jsonify
import xml.etree.ElementTree as ET
import pandas as pd
import time
from threading import Thread

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

from services.nfe_service import processa_e_salva_nfe

xml_bp = Blueprint("xml_bp", __name__)


def tarefa_de_scraping(chave):
    """
    Esta função contém toda a lógica demorada do scraping e será executada em segundo plano.
    """
    # CORREÇÃO: A importação do 'app' foi movida para DENTRO da função para quebrar o ciclo.
    from app import app 
    
    with app.app_context():
        print(f"THREAD: Iniciando scraping para a chave {chave}...")
        options = webdriver.ChromeOptions()
        # Para produção real, reative a linha abaixo. Para testes, deixe comentada.
        # options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("window-size=1920x1200")
        driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
        
        try:
            driver.get("http://www.nfe.fazenda.gov.br/portal/principal.aspx")
            wait = WebDriverWait(driver, 20)
            
            try:
                link_selector = (By.XPATH, "//a[normalize-space()='Consultar NF-e']")
                consultar_link = wait.until(EC.element_to_be_clickable(link_selector))
                consultar_link.click()
            except Exception:
                link_element = driver.find_element(By.XPATH, "//a[normalize-space()='Consultar NF-e']")
                driver.execute_script("arguments[0].click();", link_element)

            input_chave = wait.until(EC.presence_of_element_located((By.ID, "ctl00_ContentPlaceHolder1_txtChaveAcessoCompleta")))
            input_chave.send_keys(chave)
            driver.find_element(By.ID, "ctl00_ContentPlaceHolder1_btnConsultar").click()
            
            wait.until(EC.presence_of_element_located((By.ID, "ctl00_ContentPlaceHolder1_gdvItens")))
            soup = BeautifulSoup(driver.page_source, 'html.parser')

            fornecedor_info = {
                'nome': soup.find(id="ctl00_ContentPlaceHolder1_lblNomeEmitente").text.strip(),
                'cnpj': soup.find(id="ctl00_ContentPlaceHolder1_lblCnpjEmitente").text.strip()
            }
            data_emissao_str = soup.find(id="ctl00_ContentPlaceHolder1_lblDhEmissao").text.strip()
            data_cotacao = pd.to_datetime(data_emissao_str, dayfirst=True).strftime('%Y-%-m-%d')
            
            lista_materiais = []
            tabela_itens = soup.find(id="ctl00_ContentPlaceHolder1_gdvItens")
            for linha in tabela_itens.find_all("tr")[1:]:
                colunas = linha.find_all("td")
                lista_materiais.append({
                    "nome": colunas[0].text.strip(),
                    "medida": colunas[2].text.strip(),
                    "valor": float(colunas[4].text.strip().replace(',', '.'))
                })

            num_itens, fornecedor_nome = processa_e_salva_nfe(fornecedor_info, data_cotacao, lista_materiais)
            print(f"THREAD SUCESSO: {num_itens} itens de '{fornecedor_nome}' importados com sucesso!")

        except Exception as e:
            print(f"THREAD ERRO: Erro no web scraping: {e}")
            driver.save_screenshot("scraping_error_final.png")
        finally:
            driver.quit()
            print(f"THREAD: Finalizada para a chave {chave}.")


@xml_bp.route("/xml/upload", methods=["POST"])
def upload_xml():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    arquivo = request.files['file']
    if not arquivo.filename.lower().endswith('.xml'):
        return jsonify({"error": "Formato de arquivo inválido. Apenas XML é aceito."}), 400

    try:
        xml_content = arquivo.read()
        raiz = ET.fromstring(xml_content)
        ns = {"nfe": "http://www.portalfiscal.inf.br/nfe"}

        infNFe = raiz.find(".//nfe:infNFe", ns)
        if infNFe is None:
            return jsonify({"error": "XML inválido"}), 400

        fornecedor_info = {
            'nome': infNFe.find("nfe:emit/nfe:xNome", ns).text,
            'cnpj': infNFe.find("nfe:emit/nfe:CNPJ", ns).text
        }
        data_cotacao = infNFe.find("nfe:ide/nfe:dhEmi", ns).text[:10]
        
        lista_materiais = []
        for item in raiz.findall('.//nfe:det', ns):
            prod = item.find("nfe:prod", ns)
            if prod is not None:
                lista_materiais.append({
                    "nome": prod.find("nfe:xProd", ns).text,
                    "medida": prod.find("nfe:uCom", ns).text,
                    "valor": float(prod.find("nfe:vUnCom", ns).text)
                })
        
        num_itens, fornecedor_nome = processa_e_salva_nfe(fornecedor_info, data_cotacao, lista_materiais)
        return jsonify({"message": f"{num_itens} itens de '{fornecedor_nome}' importados com sucesso via XML!"}), 201

    except Exception as e:
        return jsonify({"error": f"Erro ao processar XML: {str(e)}"}), 500


@xml_bp.route("/xml/fetch-from-key", methods=['POST'])
def fetch_from_key():
    data = request.get_json()
    chave = data.get('chave')

    if not chave or len(chave) != 44 or not chave.isdigit():
        return jsonify({"error": "Chave de acesso inválida."}), 400

    thread = Thread(target=tarefa_de_scraping, args=[chave])
    thread.start()

    return jsonify({"message": "Sua solicitação foi recebida! Os dados estão sendo processados em segundo plano. Atualize a lista em breve."}), 202