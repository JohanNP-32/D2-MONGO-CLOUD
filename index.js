const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Opcional, pero bueno para evitar errores
const User = require('./models/user'); // Importamos el modelo que acabamos de crear
const app = express();

// --- Middlewares ---
app.use(express.json()); // Importante: Permite que el servidor entienda JSON
app.use(cors());
app.use(express.static('public')); // Para mostrar tu página web (frontend)

// --- Conexión a MongoDB ---
// Asegúrate de tener MONGO_URI en tus variables de entorno de Vercel
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("Falta la variable MONGO_URI");
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log('Conectado a MongoDB'))
        .catch(err => console.error('Error de conexión:', err));
}

// --- API 1: CREAR USUARIO (POST) ---
app.post('/api/users', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        
        // Crear nueva instancia del modelo
        const nuevoUsuario = new User({ nombre, email });
        
        // Guardar en base de datos
        await nuevoUsuario.save();
        
        res.status(201).json({ message: "Usuario creado con éxito", user: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario", detalles: error.message });
    }
});

// --- API 2: MOSTRAR USUARIOS (GET) ---
app.get('/api/users', async (req, res) => {
    try {
        // Buscar todos los usuarios en la BD
        const usuarios = await User.find();
        
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// --- Ruta base para servir el Frontend ---
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// --- Exportar para Vercel ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));

module.exports = app;