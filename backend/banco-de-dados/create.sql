CREATE TABLE Usuario (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    tipo VARCHAR(11) NOT NULL,
    foto VARCHAR(255),
    endereco VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao DATETIME NOT NULL,
    data_atualizacao DATETIME NOT NULL
);

CREATE TABLE Pet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_de_nascimento DATE NOT NULL,
    especie VARCHAR(255) NOT NULL,
    raca VARCHAR(255) NOT NULL,
    porte VARCHAR(255) NOT NULL,
    sexo VARCHAR(5) NOT NULL,
    temperamento VARCHAR(255) NOT NULL,
    estado_de_saude VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    necessidades TEXT NOT NULL,
    historia TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    voluntario_id VARCHAR(36),
    data_criacao DATETIME NOT NULL,
    data_atualizacao DATETIME NOT NULL,
    FOREIGN KEY (voluntario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE PetFoto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE CASCADE
);

CREATE TABLE Favorito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adotante_id VARCHAR(36) NOT NULL,
    pet_id INT NOT NULL,
    FOREIGN KEY (adotante_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE CASCADE,
    UNIQUE KEY unq_favorito_adotante_pet (adotante_id, pet_id)
);

CREATE TABLE MatchPet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adotante_id VARCHAR(36) NOT NULL,
    pet_id INT NOT NULL,
    status VARCHAR(20),
    data DATETIME NOT NULL,
    FOREIGN KEY (adotante_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE CASCADE,
    UNIQUE KEY unq_match_adotante_pet (adotante_id, pet_id)
);

CREATE TABLE Rejeicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adotante_id VARCHAR(64) NOT NULL,
    pet_id INT NOT NULL,
    data_rejeicao DATETIME NOT NULL,
    FOREIGN KEY (adotante_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE CASCADE,
    UNIQUE KEY unq_adotante_usuario_pet (adotante_id, pet_id)
);