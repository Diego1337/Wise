from flask import Blueprint, request, jsonify
from models import db, ProdutoMP

produto_mp_bp = Blueprint('produto_mp_bp', __name__)

@produto_mp_bp.route('/produto-mp', methods=['POST'])
def create_produto_mp():
    data = request.get_json()
    novo = ProdutoMP(
        id_prdt=data['id_prdt'],
        id_mp=data['id_mp'],
        quantidade=data['quantidade']
    )
    db.session.add(novo)
    db.session.commit()
    return jsonify({'message': 'Composição Produto-MP criada com sucesso!'}), 201

@produto_mp_bp.route('/produto-mp', methods=['GET'])
def get_produto_mps():
    registros = ProdutoMP.query.all()
    return jsonify([
        {
            'id_composta': r.id_composta,
            'id_prdt': r.id_prdt,
            'id_mp': r.id_mp,
            'quantidade': float(r.quantidade)
        } for r in registros
    ])

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['GET'])
def get_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    return jsonify({
        'id_composta': r.id_composta,
        'id_prdt': r.id_prdt,
        'id_mp': r.id_mp,
        'quantidade': float(r.quantidade)
    })

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['PUT'])
def update_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    data = request.get_json()
    r.id_prdt = data.get('id_prdt', r.id_prdt)
    r.id_mp = data.get('id_mp', r.id_mp)
    r.quantidade = data.get('quantidade', r.quantidade)
    db.session.commit()
    return jsonify({'message': 'Composição Produto-MP atualizada com sucesso!'})

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['DELETE'])
def delete_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'message': 'Composição Produto-MP deletada com sucesso!'})
