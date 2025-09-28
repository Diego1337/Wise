from flask import Blueprint, request, jsonify
from models import db, ProdutoMP, MateriaPrima # Adicionado MateriaPrima

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
    return jsonify({'message': 'Composição Produto-MP criada com sucesso!', 'novo_item': {'id_composta': novo.id_composta}}), 201

@produto_mp_bp.route('/produto-mp', methods=['GET'])
def get_produto_mps():
    registros = ProdutoMP.query.all()
    return jsonify([
        {'id_composta': r.id_composta, 'id_prdt': r.id_prdt, 'id_mp': r.id_mp, 'quantidade': float(r.quantidade)} 
        for r in registros
    ])

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['GET'])
def get_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    return jsonify({'id_composta': r.id_composta, 'id_prdt': r.id_prdt, 'id_mp': r.id_mp, 'quantidade': float(r.quantidade)})

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['PUT'])
def update_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    data = request.get_json()
    r.quantidade = data.get('quantidade', r.quantidade)
    db.session.commit()
    return jsonify({'message': 'Composição Produto-MP atualizada com sucesso!'})

@produto_mp_bp.route('/produto-mp/<int:id_composta>', methods=['DELETE'])
def delete_produto_mp(id_composta):
    r = ProdutoMP.query.get_or_404(id_composta)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'message': 'Composição Produto-MP deletada com sucesso!'})


# --- NOVA ROTA DE BUSCA POR PRODUTO ---
@produto_mp_bp.route('/produto-mp/by-product/<int:id_prdt>', methods=['GET'])
def get_mps_by_product(id_prdt):
    """
    Busca todas as matérias-primas e suas quantidades para um produto específico.
    """
    composicao = db.session.query(
        ProdutoMP.id_composta,
        ProdutoMP.quantidade,
        MateriaPrima.id_mp,
        MateriaPrima.nome_mp,
        MateriaPrima.uni_medida
    ).join(
        MateriaPrima, ProdutoMP.id_mp == MateriaPrima.id_mp
    ).filter(
        ProdutoMP.id_prdt == id_prdt
    ).all()

    resultado = [
        {
            "id_composta": item.id_composta,
            "id_mp": item.id_mp,
            "nome_mp": item.nome_mp,
            "quantidade": float(item.quantidade),
            "uni_medida": item.uni_medida
        } for item in composicao
    ]
    
    return jsonify(resultado)