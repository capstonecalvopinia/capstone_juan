// routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Obtener todos los "likes" de un producto
router.get('like/product/:productId', likeController.getLikesByProduct);

// Obtener todos los "likes" de un usuario
router.get('like/user/:userId', likeController.getLikesByUser);

// Crear un "like" para un producto por un usuario
router.post('like/', likeController.addLike);

// Eliminar un "like" (producto y usuario)
router.delete('/like/:productId/:userId', likeController.removeLike);

module.exports = router;
