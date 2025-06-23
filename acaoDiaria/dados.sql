-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS acao_diaria;

-- Usar o banco de dados
USE acao_diaria;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de doações
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Criar tabela de voluntários
CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    availability TEXT,
    skills TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de estatísticas
CREATE TABLE IF NOT EXISTS stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(20),
    label VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados iniciais na tabela de serviços
INSERT INTO services (title, description) VALUES 
    ('Alimentação', 'Distribuição de refeições nutritivas e água potável em pontos estratégicos da cidade.'),
    ('Higiene Pessoal', 'Kits de higiene e acesso a banheiros públicos em parceria com estabelecimentos locais.'),
    ('Acolhimento', 'Escuta ativa e encaminhamento para abrigos, serviços de saúde e programas sociais.'),
    ('Inclusão Digital', 'Acesso a telefones e computadores para contato com familiares e busca por emprego.'),
    ('Doações', 'Distribuição de roupas, cobertores e itens essenciais conforme a estação do ano.'),
    ('Oficinas', 'Cursos e workshops para desenvolvimento de habilidades e geração de renda.');

-- Inserir dados iniciais na tabela de estatísticas
INSERT INTO stats (number, label) VALUES 
    ('1240', 'Refeições Servidas'),
    ('128', 'Pessoas Acolhidas'),
    ('20', 'Voluntários Ativos'),
    ('47', 'Reinserções');
    
USE acao_diaria;
SHOW TABLES;
   
SELECT * FROM users;
SELECT * FROM volunteers;
SELECT * FROM stats;
SELECT * FROM donations;
SELECT * FROM services;
    
    
   