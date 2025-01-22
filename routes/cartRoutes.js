// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Rutas para manejar los pedidos
router.get('/carts', CartController.getAllCarts);           // Obtener todos los pedidos
router.get('/carts/:userId', CartController.getCartByUserId); // Obtener un pedido por ID
router.post('/carts', CartController.createCart);          // Crear un nuevo pedido
router.put('/carts/:userId', CartController.updateUserCart); // Actualizar un pedido
router.delete('/carts/:userId', CartController.deleteUserCart); // Eliminar un pedido

module.exports = router;
