// backend/server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

// Função para conectar ao banco de dados usando mysql2/promise
async function connectDB() {
    const db = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '1234', // Altere conforme sua senha
        database: 'acao_diaria',
        port: 3307
    });
    console.log('Conectado ao banco de dados MariaDB com sucesso!');
    return db;
}

app.use(cors());
app.use(express.json());

let db;

// Inicializa conexão e rotas só depois que o banco conectar
connectDB().then((connection) => {
    db = connection;

    // Rota teste
    app.get('/', (req, res) => {
        res.json({ message: 'API Ação Diária funcionando!' });
    });

    // Rota para serviços (cards)
    app.get('/api/services', async (req, res) => {
        try {
            // Ajuste os nomes dos campos conforme sua tabela!
            const [services] = await db.query('SELECT id, name, description FROM services');
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Rota para estatísticas (impacto)
    app.get('/api/stats', async (req, res) => {
        try {
            // Ajuste os nomes dos campos conforme sua tabela!
            const [stats] = await db.query('SELECT year, meals, peopleHelped, activeVolunteers, reinsertions FROM stats ORDER BY year DESC LIMIT 1');
            if (stats.length > 0) {
                res.json(stats[0]);
            } else {
                res.json({
                    year: new Date().getFullYear(),
                    meals: 0,
                    peopleHelped: 0,
                    activeVolunteers: 0,
                    reinsertions: 0
                });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Rota para salvar voluntários direto na tabela volunteers
    app.post('/api/volunteers', async (req, res) => {
        const { name, email, message } = req.body;
        try {
            await db.query(
                'INSERT INTO volunteers (name, email, message) VALUES (?, ?, ?)',
                [name, email, message]
            );
            res.json({ success: true, message: 'Voluntário cadastrado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao cadastrar voluntário.' });
        }
    });
    
    app.get('/api/volunteers', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM volunteers');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar voluntários.' });
        }
    });

    // Outras rotas podem ser adicionadas aqui...

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

// Tratamento de erros globais
process.on('unhandledRejection', (error) => {
    console.error('Erro não tratado:', error);
});