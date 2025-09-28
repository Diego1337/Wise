from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .produto import Produto
from .materia_prima import MateriaPrima
from .fornecedor import Fornecedor
from .preco import Preco
from .produto_mp import ProdutoMP
