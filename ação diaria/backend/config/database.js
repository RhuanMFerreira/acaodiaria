// backend/config/database.js

const mysql = require('mysql2');

// Configuração da conexão com o MariaDB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Seu usuário do MariaDB
    password: '1234',      // Sua senha do MariaDB
    database: 'acao_diaria',
    port: 3306       // Porta padrão do MariaDB
});

// Testando a conexão
db.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log('Conectado ao banco de dados MariaDB com sucesso!');
});

// Criando as tabelas se não existirem
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        availability TEXT,
        skills TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        number VARCHAR(20),
        label VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`, (err) => {
    if (err) {
        console.error('Erro ao criar tabelas:', err);
        return;
    }
    console.log('Tabelas criadas/verificadas com sucesso!');

    // Inserindo dados iniciais nas tabelas se estiverem vazias
    db.query('SELECT COUNT(*) as count FROM services', (err, results) => {
        if (err) {
            console.error('Erro ao verificar serviços:', err);
            return;
        }

        if (results[0].count === 0) {
            // Inserindo serviços iniciais
            const initialServices = [
                ['Alimentação', 'Distribuição de refeições nutritivas e água potável em pontos estratégicos da cidade.'],
                ['Higiene Pessoal', 'Kits de higiene e acesso a banheiros públicos em parceria com estabelecimentos locais.'],
                ['Acolhimento', 'Escuta ativa e encaminhamento para abrigos, serviços de saúde e programas sociais.'],
                ['Inclusão Digital', 'Acesso a telefones e computadores para contato com familiares e busca por emprego.'],
                ['Doações', 'Distribuição de roupas, cobertores e itens essenciais conforme a estação do ano.'],
                ['Oficinas', 'Cursos e workshops para desenvolvimento de habilidades e geração de renda.']
            ];

            db.query('INSERT INTO services (title, description) VALUES ?', [initialServices]);
        }
    });

    // Inserindo estatísticas iniciais
    db.query('SELECT COUNT(*) as count FROM stats', (err, results) => {
        if (err) {
            console.error('Erro ao verificar estatísticas:', err);
            return;
        }

        if (results[0].count === 0) {
            const initialStats = [
                ['1240', 'Refeições Servidas'],
                ['128', 'Pessoas Acolhidas'],
                ['20', 'Voluntários Ativos'],
                ['47', 'Reinserções']
            ];

            db.query('INSERT INTO stats (number, label) VALUES ?', [initialStats]);
        }
    });
});

// Função auxiliar para promisificar queries
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

// Exportando a conexão e a função de query
module.exports = {
    db,
    query
};