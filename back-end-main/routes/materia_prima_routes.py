from flask import Blueprint, request, jsonify
from models import db, MateriaPrima
from models.materia_prima import MateriaPrima
from models.preco import Preco
from models.fornecedor import Fornecedor 
import datetime

materia_prima_bp = Blueprint('materia_prima_bp', __name__)

@materia_prima_bp.route('/materia-prima', methods=['POST'])
def create_mp():
    data = request.get_json()
    nova_mp = MateriaPrima(
        nome_mp=data['nome'],
        uni_medida=data['medida']
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
def update_mp_all(id_mp):
    data = request.get_json()
    print(data)
    mp = MateriaPrima.query.get_or_404(id_mp)
    
    try:
        mp.nome_mp = data.get('nome', mp.nome_mp) 
        mp.uni_medida = data.get('medida', mp.uni_medida)
                
        novo_preco_valor = data.get('valor')
        novo_fornecedor_nome = data.get('fornecedor')

        if novo_preco_valor is not None and novo_fornecedor_nome:
            
            # 2a. TENTA ENCONTRAR O FORNECEDOR EXISTENTE PELO NOME
            fornecedor_existente = Fornecedor.query.filter_by(nome_fornec=novo_fornecedor_nome).first()

            if fornecedor_existente:
                    # Usa o ID do fornecedor já existente
                    id_fornec_usar = fornecedor_existente.id_fornec
                    print(f"Fornecedor encontrado: ID {id_fornec_usar}")
            else:
                # 2b. SE NÃO EXISTIR, CRIA UM NOVO FORNECEDOR
                print(f"Fornecedor não encontrado. Criando novo: {novo_fornecedor_nome}")
                novo_fornecedor = Fornecedor(
                    nome_fornec=novo_fornecedor_nome,
                    # Deixe cnpj_fornec e descricao_fornec como nulos ou use valores padrão temporários
                    cnpj_fornec='00.000.000/0000-00', 
                    descricao_fornec='Criado via atualização de MP'
                )
                db.session.add(novo_fornecedor)
                db.session.flush() # Obtém o ID do novo fornecedor antes do commit
                id_fornec_usar = novo_fornecedor.id_fornec
        
              
            # Cria o novo objeto Preco
            novo_preco = Preco(
                id_mp=mp.id_mp,
                id_fornec=id_fornec_usar,
                preco_mp=novo_preco_valor,
                data_preco=datetime.date.today()
            )
        db.session.add(novo_preco)
        db.session.commit()
        
        return jsonify({'message': 'Matéria-prima e novo preço histórico atualizados com sucesso!'})

    except Exception as e:
        db.session.rollback() # Desfaz TUDO (updates de MP e adição de Preço)
        print(f"Erro na transação de atualização: {e}")
        return jsonify({'error': f'Falha ao salvar. Transação desfeita. Detalhes: {str(e)}'}), 500

@materia_prima_bp.route('/materia-prima/<int:id_mp>', methods=['DELETE'])
def delete_mp(id_mp):
    mp = MateriaPrima.query.get_or_404(id_mp)
    
    db.session.delete(mp)
    db.session.commit()
    return jsonify({'message': 'Matéria-prima deletada com sucesso!'})