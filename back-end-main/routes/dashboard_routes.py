from flask import Blueprint, jsonify
from sqlalchemy import text
from models import db

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/api/vw_precos_detalhados', methods=['GET'])
def get_precos_detalhados():
    query = text("SELECT * FROM vw_precos_detalhados")
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)

@dashboard_bp.route('/api/vw_custo_detalhado_produto', methods=['GET'])
def get_custo_detalhado_produto():
    query = text("SELECT * FROM vw_custo_detalhado_produto")
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)

@dashboard_bp.route('/api/vw_historico_precos_mp', methods=['GET'])
def get_historico_precos_mp():
    query = text("SELECT * FROM vw_historico_precos_mp")
    result = db.session.execute(query)
    dados = [dict(row) for row in result.mappings()]
    return jsonify(dados)