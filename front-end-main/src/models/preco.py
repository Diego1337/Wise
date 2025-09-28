from . import db

class Preco(db.Model):
    __tablename__ = 'tbl_preco'
    id_preco = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_mp = db.Column(db.Integer, db.ForeignKey('tbl_materia_prima.id_mp'), nullable=False)
    id_fornec = db.Column(db.Integer, db.ForeignKey('tbl_fornecedor.id_fornec'), nullable=False)
    preco_mp = db.Column(db.Numeric(10,2))
    data_preco = db.Column(db.Date, default=db.func.current_date())
