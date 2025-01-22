// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/users', UserController.getAllUsers);

router.get('/users/financials', UserController.getFinancialUsers);

// Ruta para registrar un nuevo usuario
router.post('/users/register', UserController.registerUser);

// Ruta para el inicio de sesión del usuario
router.post('/users/login', UserController.loginUser);

// Ruta para obtener un usuario por ID
router.get('/users/:id', UserController.getUserById);

// Ruta para actualizar un usuario
router.put('/users/:id', UserController.updateUser);

// Ruta para eliminar un usuario
router.delete('/users/:id', UserController.deleteUser);

// Ruta para obtener usuarios por rol
router.get('/users/role/:rolID', UserController.getUsersByRole);

module.exports = router;
