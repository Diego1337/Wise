from flask import Blueprint, request, jsonify
from models import db, Fornecedor

fornecedor_bp = Blueprint('fornecedor_bp', __name__)

@fornecedor_bp.route('/fornecedor', methods=['POST'])
def create_fornecedor():
    data = request.get_json()
    novo_forn = Fornecedor(
        nome_fornec=data['nome_fornec'],
        cnpj_fornec=data.get('cnpj_fornec', ''),
        descricao_fornec=data.get('descricao_fornec', '')
    )
    db.session.add(novo_forn)
    db.session.commit()
    return jsonify({'message': 'Fornecedor criado com sucesso!'}), 201

@fornecedor_bp.route('/fornecedor', methods=['GET'])
def get_fornecedores():
    fornecedores = Fornecedor.query.all()
    return jsonify([
        {'id_fornec': f.id_fornec, 'nome_fornec': f.nome_fornec, 'cnpj_fornec': f.cnpj_fornec, 'descricao_fornec': f.descricao_fornec}
        for f in fornecedores
    ])

@fornecedor_bp.route('/fornecedor/<int:id_fornec>', methods=['GET'])
def get_fornecedor(id_fornec):
    f = Fornecedor.query.get_or_404(id_fornec)
    return jsonify({'id_fornec': f.id_fornec, 'nome_fornec': f.nome_fornec, 'cnpj_fornec': f.cnpj_fornec, 'descricao_fornec': f.descricao_fornec})

@fornecedor_bp.route('/fornecedor/<int:id_fornec>', methods=['PUT'])
def update_fornecedor(id_fornec):
    f = Fornecedor.query.get_or_404(id_fornec)
    data = request.get_json()
    f.nome_fornec = data.get('nome_fornec', f.nome_fornec)
    f.cnpj_fornec = data.get('cnpj_fornec', f.cnpj_fornec)
    f.descricao_fornec = data.get('descricao_fornec', f.descricao_fornec)
    db.session.commit()
    return jsonify({'message': 'Fornecedor atualizado com sucesso!'})

@fornecedor_bp.route('/fornecedor/<int:id_fornec>', methods=['DELETE'])
def delete_fornecedor(id_fornec):
    f = Fornecedor.query.get_or_404(id_fornec)
    db.session.delete(f)
    db.session.commit()
    return jsonify({'message': 'Fornecedor deletado com sucesso!'})
