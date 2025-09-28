from . import db
from sqlalchemy.orm import relationship 

class Produto(db.Model):
    __tablename__ = 'tbl_produto'
    id_prdt = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_prdt = db.Column(db.String(255))
    descricao_prdt = db.Column(db.String(255))
    data_prdt = db.Column(db.Date, default=db.func.current_date())

    produtos = relationship(
        'ProdutoMP', 
        backref='produto_ref',
        lazy=True,
        cascade="all, delete-orphan" 
    )
