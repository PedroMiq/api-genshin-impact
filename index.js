const express = require('express');
const jwt = require('jsonwebtoken');
const setupDb = require('./database');

const app = express();
const SECRET_KEY = "genshin_impact_secret_key";

app.use(express.json());

let db;

setupDb().then(database => {
    db = database;
    app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));
});

function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Se não vier o cabeçalho Authorization, já para aqui
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido (Unauthorized)' });
    }

    // Agora que garantimos que o authHeader existe, fazemos o split
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
}

app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (user === 'pedro' && password === '123456') {
        const token = jwt.sign({ id: 1 }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ auth: true, token });
    }
    res.status(401).json({ message: 'Login inválido!' });
});

app.get('/personagens', async (req, res) => {
    try {
        let { elemento, page = 1, limit = 5 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM personagens';
        let params = [];

        if (elemento) {
            query += ' WHERE elemento = ?';
            params.push(elemento);
        }

        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const lista = await db.all(query, params);
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar personagens" });
    }
});

app.get('/personagens/:id/detalhes', async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT p.nome, p.elemento, a.nome_set, a.status_principal 
        FROM personagens p
        LEFT JOIN artefatos a ON p.id = a.personagem_id
        WHERE p.id = ?
    `;
    const resultado = await db.all(query, [id]);
    res.json(resultado);
});

app.post('/personagens', verifyJWT, async (req, res) => {
    const { nome, elemento, arma } = req.body;

    if (!nome || !elemento || !arma) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const result = await db.run(
        'INSERT INTO personagens (nome, elemento, arma) VALUES (?, ?, ?)',
        [nome, elemento, arma]
    );

    res.status(201).json({ id: result.lastID, nome, elemento, arma });
});