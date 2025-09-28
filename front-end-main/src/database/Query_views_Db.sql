CREATE INDEX idx_preco_mp_data ON tbl_preco (id_mp, data_preco DESC);

CREATE OR REPLACE VIEW vw_precos_detalhados AS
SELECT 
	mp.id_mp AS id_materia_prima,
    mp.nome_mp AS nome_materia_prima,
    mp.uni_medida AS unidade_medida, 
    f.nome_fornec AS nome_fornecedor,
    p.preco_mp AS preco,
    p.data_preco AS data_cotacao
FROM 
    tbl_preco AS p
INNER JOIN 
    tbl_materia_prima AS mp ON p.id_mp = mp.id_mp
INNER JOIN 
    tbl_fornecedor AS f ON p.id_fornec = f.id_fornec;
        

CREATE OR REPLACE VIEW vw_custo_detalhado_produto AS
-- Passo 1: CTE para encontrar o preço mais recente de cada matéria-prima
WITH PrecosAtuais AS (
    SELECT 
        id_mp,
        id_fornec,
        preco_mp,
        data_preco,
        -- A função ROW_NUMBER() numera as linhas para cada matéria-prima, 
        -- ordenando pela data mais recente. A linha nº 1 é sempre a última cotação.
        ROW_NUMBER() OVER(PARTITION BY id_mp ORDER BY data_preco DESC) AS rn
    FROM 
        tbl_preco
)

-- Passo 2: Consulta principal que une todas as tabelas
SELECT
    prdt.id_prdt AS id_produto,
    prdt.nome_prdt AS nome_produto,
    mp.nome_mp AS nome_materia_prima,
    f.nome_fornec AS nome_fornecedor,
    pm.quantidade AS quantidade_utilizada,
    mp.uni_medida AS unidade_medida,
    pa.preco_mp AS preco_unitario_mp,
    pa.data_preco AS data_atualizacao_preco,
    -- Cálculo do custo do componente
    (pm.quantidade * pa.preco_mp) AS custo_por_materia_prima
FROM
    tbl_produto_mps AS pm
INNER JOIN
    tbl_produto AS prdt ON pm.id_prdt = prdt.id_prdt
INNER JOIN
    tbl_materia_prima AS mp ON pm.id_mp = mp.id_mp
INNER JOIN
    -- Juntamos com nossa CTE de preços atuais, e não com a tabela de preços inteira
    PrecosAtuais AS pa ON mp.id_mp = pa.id_mp
INNER JOIN 
    tbl_fornecedor AS f ON pa.id_fornec = f.id_fornec
WHERE
    -- Este filtro garante que estamos usando APENAS o preço mais recente (linha nº 1)
    pa.rn = 1;
    
CREATE OR REPLACE VIEW vw_historico_precos_mp AS
SELECT 
    p.id_preco, -- O ID único do registro de preço, serve como ID do histórico
    p.data_preco,
    mp.nome_mp AS nome_materia_prima,
    f.nome_fornec AS nome_fornecedor,
    p.preco_mp AS preco_unitario,
    mp.uni_medida AS unidade_medida
FROM 
    tbl_preco AS p
INNER JOIN 
    tbl_materia_prima AS mp ON p.id_mp = mp.id_mp
INNER JOIN 
    tbl_fornecedor AS f ON p.id_fornec = f.id_fornec;