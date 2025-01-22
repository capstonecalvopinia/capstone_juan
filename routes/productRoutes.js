// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Ruta para obtener todos los productos
router.get('/products', ProductController.getAllProducts);

// Ruta para registrar un nuevo producto
router.post('/products/register', ProductController.registerProduct);

// Ruta para obtener un producto por su ID
router.get('/products/:id', ProductController.getProductById);

// Ruta para actualizar un producto por su ID
router.put('/products/:id', ProductController.updateProduct);

// Ruta para eliminar un producto por su ID
router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;
