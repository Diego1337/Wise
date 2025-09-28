from flask import Flask
from flask_cors import CORS # Importa o CORS
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

app = Flask(__name__)

# --- CORREÇÃO FINAL: Configuração Explícita do CORS ---
# Em vez de apenas CORS(app), vamos ser específicos sobre a origem.
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)

# Imports e registros de blueprints
from routes.xml_routes import xml_bp
from routes.produto_routes import produto_bp
# ... (mantenha todos os seus outros imports de rotas aqui)
from routes.view_routes import view_bp

app.register_blueprint(produto_bp)
app.register_blueprint(xml_bp)
# ... (mantenha todos os seus outros registros de blueprints aqui)
app.register_blueprint(view_bp)

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