const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota teste
app.get('/', (req, res) => {
    res.json({ message: 'API Ação Diária funcionando!' });
});

// Rotas básicas
app.get('/api/services', async (req, res) => {
    try {
        const services = await db.query('SELECT * FROM services');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const stats = await db.query('SELECT * FROM stats');
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicialização
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros
process.on('unhandledRejection', (error) => {
    console.error('Erro não tratado:', error);
});