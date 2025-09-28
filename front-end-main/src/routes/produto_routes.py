from flask import Blueprint, request, jsonify
from models import db, Produto
import pandas as pd
import io

produto_bp = Blueprint('produto_bp', __name__)

@produto_bp.route('/produto/upload/csv', methods=['POST'])
def upload_produto_csv():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    file = request.files['file']
    if not file.filename.lower().endswith('.csv'):
        return jsonify({"error": "Formato de arquivo inválido. Apenas CSV é aceito."}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("UTF-8"), newline=None)
        df = pd.read_csv(stream, sep=';')
        colunas_necessarias = ['Produto', 'ID', 'Descrição']
        if not all(coluna in df.columns for coluna in colunas_necessarias):
            return jsonify({"error": "O arquivo CSV deve conter as colunas: Produto, ID, Descrição"}), 400
        novos_produtos = []
        for index, row in df.iterrows():
            novo_produto = Produto(
                nome_prdt=row['Produto'],
                codigo_prdt=row['ID'],
                descricao_prdt=row.get('Descrição', '')
            )
            novos_produtos.append(novo_produto)
        db.session.bulk_save_objects(novos_produtos)
        db.session.commit()
        return jsonify({"message": f"{len(novos_produtos)} produtos importados com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro ao processar o arquivo CSV: {str(e)}"}), 500

@produto_bp.route('/produto', methods=['POST'])
def create_produto():
    data = request.get_json()
    novo_produto = Produto(
        nome_prdt=data['nome_prdt'],
        codigo_prdt=data.get('codigo_prdt', ''),
        descricao_prdt=data.get('descricao_prdt', '')
    )
    db.session.add(novo_produto)
    db.session.commit()
    return jsonify({'message': 'Produto criado com sucesso!'}), 201

@produto_bp.route('/produto', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return jsonify([
        {'id_prdt': p.id_prdt, 'nome_prdt': p.nome_prdt, 'codigo_prdt': p.codigo_prdt, 'descricao_prdt': p.descricao_prdt, 'data_prdt': str(p.data_prdt)}
        for p in produtos
    ])

@produto_bp.route('/produto/<int:id_prdt>', methods=['GET'])
def get_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    return jsonify({'id_prdt': p.id_prdt, 'nome_prdt': p.nome_prdt, 'codigo_prdt': p.codigo_prdt, 'descricao_prdt': p.descricao_prdt, 'data_prdt': str(p.data_prdt)})

@produto_bp.route('/produto/<int:id_prdt>', methods=['PUT'])
def update_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    data = request.get_json()
    p.nome_prdt = data.get('nome_prdt', p.nome_prdt)
    p.codigo_prdt = data.get('codigo_prdt', p.codigo_prdt)
    p.descricao_prdt = data.get('descricao_prdt', p.descricao_prdt)
    db.session.commit()
    return jsonify({'message': 'Produto atualizado com sucesso!'})

@produto_bp.route('/produto/<int:id_prdt>', methods=['DELETE'])
def delete_produto(id_prdt):
    p = Produto.query.get_or_404(id_prdt)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Produto deletado com sucesso!'})