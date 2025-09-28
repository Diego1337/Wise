from models import db, MateriaPrima, Fornecedor, Preco

# CORREÇÃO: O nome da função agora está padronizado.
def processa_e_salva_nfe(fornecedor_info, data_cotacao, lista_materiais):
    """
    Serviço central para salvar dados de uma NF-e no banco de dados.
    """
    try:
        # 1. Processar Fornecedor
        forn = Fornecedor.query.filter_by(cnpj_fornec=fornecedor_info['cnpj']).first()
        if not forn:
            forn = Fornecedor(nome_fornec=fornecedor_info['nome'], cnpj_fornec=fornecedor_info['cnpj'])
            db.session.add(forn)
            db.session.flush()

        # 2. Processar cada Matéria-Prima e Preço
        for item in lista_materiais:
            mp = MateriaPrima.query.filter_by(nome_mp=item["nome"]).first()
            if not mp:
                mp = MateriaPrima(nome_mp=item["nome"], uni_medida=item["medida"])
                db.session.add(mp)
                db.session.flush()

            # 3. Criar o novo registro de preço
            novo_preco = Preco(
                id_mp=mp.id_mp,
                id_fornec=forn.id_fornec,
                preco_mp=item["valor"],
                data_preco=data_cotacao
            )
            db.session.add(novo_preco)

        db.session.commit()
        return len(lista_materiais), fornecedor_info['nome']

    except Exception as e:
        db.session.rollback()
        raise e