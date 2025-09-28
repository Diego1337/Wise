CREATE DATABASE IF NOT EXISTS db_costwise;

USE db_costwise;

CREATE TABLE IF NOT EXISTS tbl_produto (
    id_prdt         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_prdt       VARCHAR(255),
    descricao_prdt  VARCHAR(255),
    data_prdt       DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS tbl_materia_prima (
    id_mp       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_mp     VARCHAR(255),
    uni_medida  VARCHAR(255),
    data_mp     DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS tbl_fornecedor (
    id_fornec   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_fornec VARCHAR(255),
    cnpj_fornec VARCHAR(255),
    descricao_fornec    VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tbl_preco (
    id_preco    INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_mp       INT NOT NULL,
    id_fornec   INT NOT NULL,
    preco_mp    DECIMAL(10, 2),
    data_preco  DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (id_mp) REFERENCES tbl_materia_prima(id_mp),
    FOREIGN KEY (id_fornec) REFERENCES tbl_fornecedor(id_fornec)
);

CREATE TABLE IF NOT EXISTS tbl_produto_mps (
    id_composta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_prdt     INT NOT NULL,
    id_mp       INT NOT NULL,
    quantidade  DECIMAL(10, 2),
    FOREIGN KEY (id_prdt) REFERENCES tbl_produto(id_prdt),
    FOREIGN KEY (id_mp) REFERENCES tbl_materia_prima(id_mp)
);