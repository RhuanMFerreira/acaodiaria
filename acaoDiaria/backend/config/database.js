// backend/config/database.js

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',  // sua senha aqui
    database: 'acao_diaria',
    port: 3307
});

db.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log('Conectado ao banco de dados MariaDB com sucesso!');
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

// Tratamento de erro de conexão perdida
db.on('error', (err) => {
    console.error('Erro de conexão DB:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconectando ao banco...');
        db.connect();
    }
});

module.exports = {
    db,
    query
};