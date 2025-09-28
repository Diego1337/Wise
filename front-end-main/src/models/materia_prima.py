from . import db

class MateriaPrima(db.Model):
    __tablename__ = 'tbl_materia_prima'
    id_mp = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_mp = db.Column(db.String(255))
    uni_medida = db.Column(db.String(255))
    data_mp = db.Column(db.Date, default=db.func.current_date())
