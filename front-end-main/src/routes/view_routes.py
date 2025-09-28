from flask import Blueprint, jsonify
from models import db
from sqlalchemy import text

view_bp = Blueprint('view_bp', __name__)

@view_bp.route('/vw_precos_detalhados', methods=['GET'])
def get_precos_detalhados():
    query = text("""
        SELECT 
            mp.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            mp.uni_medida AS unidade_medida,
            f.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            p.id_preco AS id_preco,
            p.preco_mp AS preco,
            p.data_preco AS data_cotacao
        FROM tbl_preco AS p
        INNER JOIN tbl_materia_prima AS mp ON p.id_mp = mp.id_mp
        INNER JOIN tbl_fornecedor AS f ON p.id_fornec = f.id_fornec
    """)
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)


@view_bp.route('/vw_custo_detalhado_produto', methods=['GET'])
def get_custo_detalhado_produto():
    query = text("""
        WITH PrecosAtuais AS (
            SELECT 
                id_mp,
                id_fornec,
                preco_mp,
                data_preco,
                ROW_NUMBER() OVER(PARTITION BY id_mp ORDER BY data_preco DESC) AS rn
            FROM tbl_preco
        )
        SELECT
            prdt.id_prdt AS id_produto,
            prdt.nome_prdt AS nome_produto,
            mp.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            f.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            pm.quantidade AS quantidade_utilizada,
            mp.uni_medida AS unidade_medida,
            pa.preco_mp AS preco_unitario_mp,
            pa.data_preco AS data_atualizacao_preco,
            (pm.quantidade * pa.preco_mp) AS custo_por_materia_prima
        FROM tbl_produto_mps AS pm
        INNER JOIN tbl_produto AS prdt ON pm.id_prdt = prdt.id_prdt
        INNER JOIN tbl_materia_prima AS mp ON pm.id_mp = mp.id_mp
        INNER JOIN PrecosAtuais AS pa ON mp.id_mp = pa.id_mp
        INNER JOIN tbl_fornecedor AS f ON pa.id_fornec = f.id_fornec
        WHERE pa.rn = 1
    """)
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)

@view_bp.route('/vw_custo_detalhado_produto/<int:id_produto>', methods=['GET'])
def get_custo_detalhado_produto_by_id(id_produto):
    query = text("""
        WITH PrecosAtuais AS (
            SELECT 
                id_mp,
                id_fornec,
                preco_mp,
                data_preco,
                ROW_NUMBER() OVER(PARTITION BY id_mp ORDER BY data_preco DESC) AS rn
            FROM tbl_preco
        )
        SELECT
            prdt.id_prdt AS id_produto,
            prdt.nome_prdt AS nome_produto,
            mp.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            f.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            pm.quantidade AS quantidade_utilizada,
            mp.uni_medida AS unidade_medida,
            pa.preco_mp AS preco_unitario_mp,
            pa.data_preco AS data_atualizacao_preco,
            (pm.quantidade * pa.preco_mp) AS custo_por_materia_prima
        FROM tbl_produto_mps AS pm
        INNER JOIN tbl_produto AS prdt ON pm.id_prdt = prdt.id_prdt
        INNER JOIN tbl_materia_prima AS mp ON pm.id_mp = mp.id_mp
        INNER JOIN PrecosAtuais AS pa ON mp.id_mp = pa.id_mp
        INNER JOIN tbl_fornecedor AS f ON pa.id_fornec = f.id_fornec
        WHERE pa.rn = 1
          AND prdt.id_prdt = :id_produto
    """)
    result = db.session.execute(query, {"id_produto": id_produto})
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)


@view_bp.route('/vw_historico_precos_mp', methods=['GET'])
def get_historico_precos_mp():
    query = text("""
        SELECT 
            p.id_preco,
            p.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            p.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            p.preco_mp AS preco_unitario,
            mp.uni_medida AS unidade_medida,
            p.data_preco
        FROM tbl_preco AS p
        INNER JOIN tbl_materia_prima AS mp ON p.id_mp = mp.id_mp
        INNER JOIN tbl_fornecedor AS f ON p.id_fornec = f.id_fornec
    """)
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)

@view_bp.route('/vw_historico_precos_mp/<int:id_mp>', methods=['GET'])
def get_historico_precos_mp_by_id(id_mp):
    query = text("""
        SELECT 
            p.id_preco,
            p.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            p.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            p.preco_mp AS preco_unitario,
            mp.uni_medida AS unidade_medida,
            p.data_preco
        FROM tbl_preco AS p
        INNER JOIN tbl_materia_prima AS mp ON p.id_mp = mp.id_mp
        INNER JOIN tbl_fornecedor AS f ON p.id_fornec = f.id_fornec
        WHERE mp.id_mp = :id_mp
        ORDER BY p.data_preco DESC
    """)
    
    result = db.session.execute(query, {"id_mp": id_mp})
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)


@view_bp.route('/vw_preco_atual_mp', methods=['GET'])
def get_preco_atual_mp():
    query = text("""
        WITH PrecosRecentes AS (
            SELECT 
                p.id_preco,
                p.id_mp,
                p.id_fornec,
                p.preco_mp,
                p.data_preco,
                ROW_NUMBER() OVER(PARTITION BY p.id_mp ORDER BY p.data_preco DESC) AS rn
            FROM tbl_preco AS p
        )
        SELECT
            pr.id_preco,
            pr.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            pr.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            pr.preco_mp AS preco_unitario,
            mp.uni_medida AS unidade_medida,
            pr.data_preco AS data_atualizacao_preco
        FROM PrecosRecentes AS pr
        INNER JOIN tbl_materia_prima AS mp ON pr.id_mp = mp.id_mp
        INNER JOIN tbl_fornecedor AS f ON pr.id_fornec = f.id_fornec
        WHERE pr.rn = 1
    """)
    
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)

@view_bp.route('/vw_preco_atual_mp/<int:id_mp>', methods=['GET'])
def get_preco_atual_mp_by_id(id_mp):
    query = text("""
        WITH PrecosRecentes AS (
            SELECT 
                p.id_preco,
                p.id_mp,
                p.id_fornec,
                p.preco_mp,
                p.data_preco,
                ROW_NUMBER() OVER(PARTITION BY p.id_mp ORDER BY p.data_preco DESC) AS rn
            FROM tbl_preco AS p
        )
        SELECT
            pr.id_preco,
            pr.id_mp AS id_materia_prima,
            mp.nome_mp AS nome_materia_prima,
            pr.id_fornec AS id_fornecedor,
            f.nome_fornec AS nome_fornecedor,
            pr.preco_mp AS preco_unitario,
            mp.uni_medida AS unidade_medida,
            pr.data_preco AS data_atualizacao_preco
        FROM PrecosRecentes AS pr
        INNER JOIN tbl_materia_prima AS mp ON pr.id_mp = mp.id_mp
        INNER JOIN tbl_fornecedor AS f ON pr.id_fornec = f.id_fornec
        WHERE pr.rn = 1
          AND pr.id_mp = :id_mp
    """)
    
    result = db.session.execute(query, {"id_mp": id_mp})
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)
