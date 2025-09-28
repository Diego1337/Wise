from flask import Flask
from routes.xml_routes import xml_bp
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db
from flask_cors import CORS
from routes.produto_routes import produto_bp
from routes.materia_prima_routes import materia_prima_bp
from routes.fornecedor_routes import fornecedor_bp
from routes.preco_routes import preco_bp
from routes.produto_mp_routes import produto_mp_bp
from routes.view_routes import view_bp
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)

# registrar blueprints
app.register_blueprint(produto_bp)
app.register_blueprint(materia_prima_bp)
app.register_blueprint(fornecedor_bp)
app.register_blueprint(preco_bp)
app.register_blueprint(produto_mp_bp)
app.register_blueprint(view_bp)
app.register_blueprint(xml_bp)

@app.route('/')
def index():
    return 'Health'

if __name__ == '__main__':
    engine = create_engine(SQLALCHEMY_DATABASE_URI)

    if not database_exists(engine.url):
        create_database(engine.url)

    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3001)
