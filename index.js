const express = require('express');
const connectDB = require('./db');
const User = require('./models/user'); // Importamos el modelo

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

// --- API ROUTES ---

// 1. POST: Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const newUser = new User({ nombre, email });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. GET: Obtener todos los usuarios (El "Select")
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta principal con un botón básico para probar el GET
app.get('/', (req, res) => {
    res.send(`
        <h1>API MongoDB Atlas</h1>
        <button onclick="fetchUsers()">Obtener Usuarios (GET USER)</button>
        <div id="lista"></div>
        <script>
            async function fetchUsers() {
                const res = await fetch('/api/users');
                const data = await res.json();
                document.getElementById('lista').innerText = JSON.stringify(data, null, 2);
            }
        </script>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;