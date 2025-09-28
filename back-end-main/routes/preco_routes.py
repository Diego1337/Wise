from flask import Blueprint, request, jsonify
from models import db, Preco

preco_bp = Blueprint('preco_bp', __name__)

@preco_bp.route('/preco', methods=['POST'])
def create_preco():
    data = request.get_json()
    novo_preco = Preco(
        id_mp=data['id_mp'],
        id_fornec=data['id_fornec'],
        preco_mp=data['preco_mp']
    )
    db.session.add(novo_preco)
    db.session.commit()
    return jsonify({'message': 'Preço criado com sucesso!'}), 201

@preco_bp.route('/preco', methods=['GET'])
def get_precos():
    precos = Preco.query.all()
    return jsonify([
        {
            'id_preco': p.id_preco,
            'id_mp': p.id_mp,
            'id_fornec': p.id_fornec,
            'preco_mp': float(p.preco_mp),
            'data_preco': str(p.data_preco)
        } for p in precos
    ])

@preco_bp.route('/preco/<int:id_preco>', methods=['GET'])
def get_preco(id_preco):
    p = Preco.query.get_or_404(id_preco)
    return jsonify({
        'id_preco': p.id_preco,
        'id_mp': p.id_mp,
        'id_fornec': p.id_fornec,
        'preco_mp': float(p.preco_mp),
        'data_preco': str(p.data_preco)
    })

@preco_bp.route('/preco/<int:id_preco>', methods=['PUT'])
def update_preco(id_preco):
    p_antigo = Preco.query.get_or_404(id_preco)
    data = request.get_json()
    
    # Criar novo registro com preço atualizado
    novo_preco = Preco(
        id_mp=p_antigo.id_mp,
        id_fornec=p_antigo.id_fornec,
        preco_mp=data.get('preco_mp', p_antigo.preco_mp)
    )
    
    db.session.add(novo_preco)
    db.session.commit()
    
    return jsonify({'message': 'Preço atualizado e histórico registrado com sucesso!'})

@preco_bp.route('/preco/<int:id_preco>', methods=['DELETE'])
def delete_preco(id_preco):
    p = Preco.query.get_or_404(id_preco)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Preço deletado com sucesso!'})
