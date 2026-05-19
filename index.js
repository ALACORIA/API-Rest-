const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares esenciales
app.use(express.json()); // Permite parsear el body de las peticiones en formato JSON
app.use(cors()); // Habilita CORS para permitir peticiones desde otros dominios o frontend

// Simulación de base de datos en memoria
let usuarios = [];
let nextId = 1;

// ==========================================
// Rutas de Control y Bienvenida
// ==========================================

// GET / -> Ruta inicial de bienvenida para verificar que la API está viva en Render
app.get('/', (req, res) => {
    res.send('¡API REST funcionando correctamente! Dirígete a /api/usuarios para ver los datos.');
});

// ==========================================
// Rutas del CRUD (Entidad: Usuario)
// ==========================================

// GET /api/usuarios -> Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});

// GET /api/usuarios/:id -> Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
});

// POST /api/usuarios -> Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    const { nombre, email, rol } = req.body;

    // Validación básica de campos vacíos
    if (!nombre || !email || !rol) {
        return res.status(400).json({ 
            mensaje: 'Todos los campos (nombre, email, rol) son obligatorios y no pueden estar vacíos' 
        });
    }

    const nuevoUsuario = {
        id: nextId++,
        nombre,
        email,
        rol
    };

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// PUT /api/usuarios/:id -> Actualizar un usuario existente
app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, rol } = req.body;

    const usuarioIndex = usuarios.findIndex(u => u.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Validación básica para la actualización
    if (!nombre || !email || !rol) {
        return res.status(400).json({ 
            mensaje: 'Todos los campos (nombre, email, rol) son obligatorios y no pueden estar vacíos' 
        });
    }

    // Actualizamos el usuario en el arreglo
    usuarios[usuarioIndex] = {
        id, // Mantenemos el mismo ID
        nombre,
        email,
        rol
    };

    res.json(usuarios[usuarioIndex]);
});

// DELETE /api/usuarios/:id -> Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Eliminamos el usuario del arreglo usando splice
    const usuarioEliminado = usuarios.splice(usuarioIndex, 1)[0];
    
    res.json({ 
        mensaje: 'Usuario eliminado correctamente', 
        usuario: usuarioEliminado 
    });
});

// ==========================================
// Configuración del puerto y arranque del servidor
// ==========================================

// Se usa process.env.PORT para que Render asigne el puerto dinámicamente en producción
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor API REST corriendo en el puerto ${PORT}`);
});