from flask import Blueprint, request, jsonify
import xml.etree.ElementTree as ET
import pandas as pd
from datetime import date
from models import db, MateriaPrima, Fornecedor, Preco

xml_bp = Blueprint("xml_bp", __name__)

@xml_bp.route("/xml/upload", methods=["POST"])
def processar_xml():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400

        arquivo = request.files['file']
        arvore = ET.parse(arquivo)
        raiz = arvore.getroot()
        ns = {"nfe": "http://www.portalfiscal.inf.br/nfe"}

        infNFe = raiz.find(".//nfe:infNFe", ns)
        if infNFe is None:
            return jsonify({"error": "XML inválido"}), 400

        emit = infNFe.find("nfe:emit", ns)
        chave_acesso = infNFe.attrib.get('Id')
        emissor = emit.find("nfe:xNome", ns).text if emit.find("nfe:xNome", ns) is not None else None
        cnpj_emissor = emit.find("nfe:CNPJ", ns).text if emit.find("nfe:CNPJ", ns) is not None else None

        dh_emi_element = infNFe.find("nfe:ide/nfe:dhEmi", ns)
        data_emissao = dh_emi_element.text[:10] if dh_emi_element is not None else None

        dados = []
        for item in raiz.findall('.//nfe:det', ns):
            prod = item.find("nfe:prod", ns)
            if prod is not None:
                descricao = prod.find("nfe:xProd", ns).text if prod.find("nfe:xProd", ns) is not None else None
                un = prod.find("nfe:uCom", ns).text if prod.find("nfe:uCom", ns) is not None else None
                quantidade = prod.find("nfe:qCom", ns).text if prod.find("nfe:qCom", ns) is not None else None
                v_unitario = prod.find("nfe:vUnCom", ns).text if prod.find("nfe:vUnCom", ns) is not None else None

                dados.append({
                    "descricao_produto": descricao,
                    "unidade_medida": un,
                    "quantidade": float(quantidade) if quantidade else 0,
                    "valor_unitario": float(v_unitario) if v_unitario else 0,
                })

        # Inserção no banco
        for item in dados:
            # 1️⃣ Matéria-prima (produto)
            mp = MateriaPrima.query.filter_by(nome_mp=item["descricao_produto"]).first()
            if not mp:
                mp = MateriaPrima(nome_mp=item["descricao_produto"], uni_medida=item["unidade_medida"])
                db.session.add(mp)
                db.session.flush()  # garante que mp.id_mp exista para o FK

            # 2️⃣ Fornecedor
            forn = Fornecedor.query.filter_by(cnpj_fornec=cnpj_emissor).first()
            if not forn:
                forn = Fornecedor(nome_fornec=emissor, cnpj_fornec=cnpj_emissor)
                db.session.add(forn)
                db.session.flush()  # garante que forn.id_fornec exista

            # 3️⃣ Preço
            preco = Preco(
                id_mp=mp.id_mp,
                id_fornec=forn.id_fornec,
                preco_mp=item["valor_unitario"]
            )
            db.session.add(preco)

        db.session.commit()
        return jsonify({"message": "XML processado com sucesso", "linhas": len(dados)}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
