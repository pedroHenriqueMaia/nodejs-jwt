import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'

const app = express();
const PORT = process.env.PORT || 3000;
// lembrar de colocar em um arquivo .env
const SECRET_KEY = 'mysecretkey';

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Rota protegida alcançada!' });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
