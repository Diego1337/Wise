from . import db

class Fornecedor(db.Model):
    __tablename__ = 'tbl_fornecedor'
    id_fornec = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_fornec = db.Column(db.String(255))
    cnpj_fornec = db.Column(db.String(255))
    descricao_fornec = db.Column(db.String(255))
