CREATE DATABASE atividade_produtos;
USE atividade_produtos;

CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NULL,
    quantidade INT NULL,
    valor DECIMAL(10, 2) NULL,
    data DATE NULL
);