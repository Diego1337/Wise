from flask import Blueprint, request, jsonify
from models import db, Produto

produto_bp = Blueprint('produto_bp', __name__)

@produto_bp.route('/produto', methods=['POST'])
def create_produto():
    data = request.get_json()
    novo_produto = Produto(
        nome_prdt=data['nome_prdt'],
        descricao_prdt=data.get('descricao_prdt', '')
    )
    db.session.add(novo_produto)
    db.session.commit()
    return jsonify({'message': 'Produto criado com sucesso!'}), 201

@produto_bp.route('/produto', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return jsonify([
        {'id_prdt': p.id_prdt, 'nome_prdt': p.nome_prdt, 'descricao_prdt': p.descricao_prdt, 'data_prdt': str(p.data_prdt)}
        for p in produtos
    ])

@produto_bp.route('/produto/<int:id_prdt>', methods=['GET'])
def get_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    return jsonify({'id_prdt': p.id_prdt, 'nome_prdt': p.nome_prdt, 'descricao_prdt': p.descricao_prdt, 'data_prdt': str(p.data_prdt)})

@produto_bp.route('/produto/<int:id_prdt>', methods=['PUT'])
def update_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    data = request.get_json()
    p.nome_prdt = data.get('nome_prdt', p.nome_prdt)
    p.descricao_prdt = data.get('descricao_prdt', p.descricao_prdt)
    db.session.commit()
    return jsonify({'message': 'Produto atualizado com sucesso!'})

@produto_bp.route('/produto/<int:id_prdt>', methods=['DELETE'])
def delete_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Produto deletado com sucesso!'})
