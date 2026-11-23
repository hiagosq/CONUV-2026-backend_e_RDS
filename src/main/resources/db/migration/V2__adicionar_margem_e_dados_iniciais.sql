ALTER TABLE salgados
    ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

INSERT INTO salgados (nome, categoria, custo_unitario, preco_venda, quantidade_estoque, ativo)
VALUES
    ('Coxinha de frango com catupiry', 'Frito', 3.00, 6.50, 30, TRUE),
    ('Esfiha de carne assada', 'Assado', 2.50, 5.50, 20, TRUE),
    ('Cento de mini risoles (100 un.)', 'Mini', 45.00, 89.90, 5, TRUE);