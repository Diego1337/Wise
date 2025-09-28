USE db_costwise;

SELECT * FROM vw_precos_detalhados;

SELECT * FROM vw_custo_detalhado_produto
ORDER BY nome_produto, nome_materia_prima;

SELECT * FROM vw_historico_precos_mp
ORDER BY data_preco DESC, id_preco DESC;