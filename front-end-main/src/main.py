# Mantenha todos os seus imports aqui
import pandas as pd
import mysql.connector
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Thread # Importante para a tarefa em segundo plano

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# --- Configuração do App e do Banco (igual ao que já temos) ---
app = Flask(__name__)
CORS(app) # Garante que o CORS está habilitado

DB_CONFIG = { 'host': 'localhost', 'database': 'db_costwise', 'user': 'root', 'password': 'root' }

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def salva_materiais_no_db(lista_materiais):
    # (função sem alteração)
    if not lista_materiais:
        raise ValueError("Nenhum item de produto encontrado para salvar.")
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO materias_primas 
        (nome, medida, valor, fornecedor, data_cotacao, chave_acesso_nfe) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    valores_para_inserir = [
        (item['nome'], item['medida'], item['valor'], item['fornecedor'], item['data_cotacao'], item['chave_acesso_nfe']) 
        for item in lista_materiais
    ]
    cursor.executemany(query, valores_para_inserir)
    conn.commit()
    cursor.close()
    conn.close()
    return len(valores_para_inserir), lista_materiais[0]['fornecedor']


# --- TAREFA DE SCRAPING EM SEGUNDO PLANO ---
def tarefa_de_scraping(chave):
    with app.app_context():
        print(f"THREAD: Iniciando scraping para a chave {chave}...")
        options = webdriver.ChromeOptions()
        options.add_argument("--headless") # Reativado para não abrir o navegador
        options.add_argument("--disable-gpu")
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
            data_cotacao = pd.to_datetime(data_emissao_str, dayfirst=True).strftime('%Y-%m-%d')
            
            lista_materiais = []
            tabela_itens = soup.find(id="ctl00_ContentPlaceHolder1_gdvItens")
            for linha in tabela_itens.find_all("tr")[1:]:
                colunas = linha.find_all("td")
                lista_materiais.append({
                    "nome": colunas[0].text.strip(), "medida": colunas[2].text.strip(),
                    "valor": float(colunas[4].text.strip().replace(',', '.'))
                })
            
            num_itens, fornecedor_nome = salva_materiais_no_db(lista_materiais)
            print(f"THREAD SUCESSO: {num_itens} itens de '{fornecedor_nome}' importados com sucesso!")
        except Exception as e:
            print(f"THREAD ERRO: Erro no web scraping: {e}")
        finally:
            driver.quit()
            print(f"THREAD: Finalizada para a chave {chave}.")

# --- ROTA ASSÍNCRONA ---
@app.route("/api/fetch-from-key", methods=['POST'])
def fetch_from_key():
    data = request.get_json()
    chave = data.get('chave')
    if not chave or len(chave) != 44 or not chave.isdigit():
        return jsonify({"error": "Chave de acesso inválida."}), 400
    
    # Inicia a tarefa em segundo plano
    thread = Thread(target=tarefa_de_scraping, args=[chave])
    thread.start()
    
    # Retorna uma resposta IMEDIATA para o front-end
    return jsonify({"message": "Solicitação recebida! A NF-e está sendo processada. Atualize a lista em 1 ou 2 minutos."}), 202

@app.route("/api/materias-primas", methods=['GET'])
def get_materias_primas():
    # ... (rota sem alteração)
    conn = get_db_connection()
    df = pd.read_sql("SELECT * FROM materias_primas", conn)
    conn.close()
    return df.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True, port=3001)
