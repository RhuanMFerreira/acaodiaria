// backend/server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, query } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'sua_chave_secreta_jwt';

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Rotas de Autenticação
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword]);
        
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro no login' });
    }
});

// Rotas de Serviços
app.get('/api/services', async (req, res) => {
    try {
        const services = await query('SELECT * FROM services WHERE active = true');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
});

// Rotas de Estatísticas
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await query('SELECT * FROM stats');
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

// Rotas de Doações
app.post('/api/donations', authenticateToken, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        await query('INSERT INTO donations (donor_id, type, amount, description) VALUES (?, ?, ?, ?)',
            [req.user.id, type, amount, description]);
        
        res.status(201).json({ message: 'Doação registrada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar doação' });
    }
});

app.get('/api/donations', authenticateToken, async (req, res) => {
    try {
        const donations = await query('SELECT * FROM donations WHERE donor_id = ?', [req.user.id]);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar doações' });
    }
});

// Rotas de Voluntários
app.post('/api/volunteers', authenticateToken, async (req, res) => {
    try {
        const { availability, skills } = req.body;
        await query('INSERT INTO volunteers (user_id, availability, skills) VALUES (?, ?, ?)',
            [req.user.id, availability, skills]);
        
        res.status(201).json({ message: 'Cadastro de voluntário realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar voluntário' });
    }
});

// Rota de Dashboard (protegida)
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const stats = await query('SELECT * FROM stats');
        const recentDonations = await query('SELECT * FROM donations ORDER BY created_at DESC LIMIT 5');
        const recentVolunteers = await query('SELECT * FROM volunteers ORDER BY created_at DESC LIMIT 5');
        
        res.json({
            stats,
            recentDonations,
            recentVolunteers
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros global
process.on('unhandledRejection', (error) => {
    console.error('Erro não tratado:', error);
});