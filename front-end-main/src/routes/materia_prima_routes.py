from flask import Blueprint, request, jsonify
from models import db, MateriaPrima

materia_prima_bp = Blueprint('materia_prima_bp', __name__)

@materia_prima_bp.route('/materia-prima', methods=['POST'])
def create_mp():
    data = request.get_json()
    nova_mp = MateriaPrima(
        nome_mp=data['nome_mp'],
        uni_medida=data['uni_medida']
    )
    db.session.add(nova_mp)
    db.session.commit()
    return jsonify({'message': 'Matéria-prima criada com sucesso!'}), 201

@materia_prima_bp.route('/materia-prima', methods=['GET'])
def get_mps():
    mps = MateriaPrima.query.all()
    return jsonify([
        {'id_mp': mp.id_mp, 'nome_mp': mp.nome_mp, 'uni_medida': mp.uni_medida, 'data_mp': str(mp.data_mp)}
        for mp in mps
    ])

@materia_prima_bp.route('/materia-prima/<int:id_mp>', methods=['GET'])
def get_mp(id_mp):
    mp = MateriaPrima.query.get_or_404(id_mp)
    return jsonify({'id_mp': mp.id_mp, 'nome_mp': mp.nome_mp, 'uni_medida': mp.uni_medida, 'data_mp': str(mp.data_mp)})

@materia_prima_bp.route('/materia-prima/<int:id_mp>', methods=['PUT'])
def update_mp(id_mp):
    mp = MateriaPrima.query.get_or_404(id_mp)
    data = request.get_json()
    mp.nome_mp = data.get('nome_mp', mp.nome_mp)
    mp.uni_medida = data.get('uni_medida', mp.uni_medida)
    db.session.commit()
    return jsonify({'message': 'Matéria-prima atualizada com sucesso!'})

@materia_prima_bp.route('/materia-prima/<int:id_mp>', methods=['DELETE'])
def delete_mp(id_mp):
    mp = MateriaPrima.query.get_or_404(id_mp)
    db.session.delete(mp)
    db.session.commit()
    return jsonify({'message': 'Matéria-prima deletada com sucesso!'})
