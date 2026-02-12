const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // Importamos el modelo
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// --- Conexión y Creación del Usuario Predeterminado ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("Falta la variable MONGO_URI");
} else {
    mongoose.connect(mongoUri)
        .then(async () => {
            console.log('Conectado a MongoDB');
            
            // --- AQUÍ ESTÁ LA MAGIA ---
            // Revisamos si ya existe el usuario predeterminado
            const usuarioExistente = await User.findOne({ email: "juan@ejemplo.com" });
            
            if (!usuarioExistente) {
                // Si no existe, lo creamos
                await User.create({
                    nombre: "Juan Pérez (Predeterminado)",
                    email: "juan@ejemplo.com"
                });
                console.log("Usuario predeterminado creado con éxito.");
            } else {
                console.log("El usuario predeterminado ya existía.");
            }
            // ---------------------------
        })
        .catch(err => console.error('Error de conexión:', err));
}

// --- API: MOSTRAR USUARIOS (GET) ---
app.get('/api/users', async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// --- Ruta base ---
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));

module.exports = app;