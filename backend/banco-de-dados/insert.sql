INSERT INTO `usuario` (`id`, `nome`, `email`, `telefone`, `senha`, `data_nascimento`, `cpf_cnpj`, `tipo`, `foto`, `endereco`, `descricao`, `data_criacao`, `data_atualizacao`) VALUES
('1f1f1d88-c365-4d59-b38b-d06ad2186a8b', 'Maria Fernanda', 'adotante@gmail.com', '(34) 99999-8888', '$2y$10$bjwFBSYFWyRHniRGyzDpTuIkYlGSbiHhcHJ0YCNCWPfGypGM0sF.S', '1997-09-01', '111.111.111-11', 'adotante', 'https://res.cloudinary.com/elza2uolj/image/upload/v1757911132/xnxkrmrz1wheye5rmh5n.jpg', '{\"cep\":\"38400-753\",\"logradouro\":\"Avenida Estrêla do Sul\",\"bairro\":\"Bom Jesus\",\"cidade\":\"Uberlândia\",\"estado\":\"MG\"}', '', '2025-09-15 01:38:55', '2025-09-15 01:38:55'),
('de97b1e5-f116-4863-9419-7e599f80917b', 'José da Silva', 'voluntario@gmail.com', '(34) 99999-7777', '$2y$10$8T.YYp2He1opCNGwc48VMeq8QE.3c3r4NlRdYf5rvOhQwyL0FdH0m', '1993-03-09', '222.222.222-22', 'voluntario', 'https://res.cloudinary.com/elza2uolj/image/upload/v1757912922/homem-afro-americano-de-oculos-redondos_nq8o0z.jpg', '{\"cep\":\"38408-517\",\"logradouro\":\"Alameda Arnolde de Almeida Castro\",\"bairro\":\"Lagoinha\",\"cidade\":\"Uberlândia\",\"estado\":\"MG\"}', '', '2025-09-15 01:49:48', '2025-09-15 01:49:48');

INSERT INTO `Pet` (`nome`, `data_de_nascimento`, `especie`, `raca`, `porte`, `sexo`, `temperamento`, `estado_de_saude`, `endereco`, `necessidades`, `historia`, `status`, `voluntario_id`, `data_criacao`, `data_atualizacao`) VALUES
('Bob', '2023-05-10', 'Canino', 'Golden Retriever', 'Grande', 'Macho', 'Brincalhão', 'Vacinado e vermifugado', '{"cep":"38400-753","logradouro":"Avenida Estrêla do Sul","bairro":"Bom Jesus","cidade":"Uberlândia","estado":"MG"}', 'Nenhuma', 'Bob foi encontrado na rua e agora busca um lar amoroso.', 'Disponível', 'de97b1e5-f116-4863-9419-7e599f80917b', NOW(), NOW()),
('Amora', '2024-01-20', 'Felino', 'Sem raça definida', 'Pequeno', 'Fêmea', 'Tímida', 'Vacinada', '{"cep":"38408-517","logradouro":"Alameda Arnolde de Almeida Castro","bairro":"Lagoinha","cidade":"Uberlândia","estado":"MG"}', 'Alimentação especial para pelos longos.', 'Amora é uma gatinha resgatada, que precisa de um lar tranquilo.', 'Em andamento', 'de97b1e5-f116-4863-9419-7e599f80917b', NOW(), NOW()),
('Floco', '2024-03-05', 'Coelho', 'Angorá', 'Pequeno', 'Macho', 'Calmo', 'Saudável', '{"cep":"38408-517","logradouro":"Alameda Arnolde de Almeida Castro","bairro":"Lagoinha","cidade":"Uberlândia","estado":"MG"}', 'Ambiente com forragem e dieta controlada.', 'Floco foi deixado em uma caixa de papelão na porta de um petshop, agora espera uma família.', 'Adotado', 'de97b1e5-f116-4863-9419-7e599f80917b', NOW(), NOW());

INSERT INTO PetFoto (`pet_id`, `url`) VALUES
((SELECT id FROM Pet WHERE nome = 'Bob' LIMIT 1), 'https://res.cloudinary.com/elza2uolj/image/upload/v1757913500/golden_retriever_s88g0m.jpg');

INSERT INTO PetFoto (`pet_id`, `url`) VALUES
((SELECT id FROM Pet WHERE nome = 'Amora' LIMIT 1), 'https://res.cloudinary.com/elza2uolj/image/upload/v1757913550/gato_siames_e0s3r1.jpg');

INSERT INTO PetFoto (`pet_id`, `url`) VALUES
((SELECT id FROM Pet WHERE nome = 'Floco' LIMIT 1), 'https://res.cloudinary.com/elza2uolj/image/upload/v1757913600/coelho_fofo_a5w2k1.jpg');