from . import db

class ProdutoMP(db.Model):
    __tablename__ = 'tbl_produto_mps'
    id_composta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_prdt = db.Column(db.Integer, db.ForeignKey('tbl_produto.id_prdt'), nullable=False)
    id_mp = db.Column(db.Integer, db.ForeignKey('tbl_materia_prima.id_mp'), nullable=False)
    quantidade = db.Column(db.Numeric(10,2))
