// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');

// Rutas para manejar los pedidos
// router.get('/carts', CartController.getAllCarts);
// router.get('/carts/:userId', CartController.getCartByUserId);
// router.post('/carts', CartController.createCart);
// router.put('/carts/:userId', CartController.updateUserCart);
// router.delete('/carts/:userId', CartController.deleteUserCart);

router.post('/recommendations/pastPurchases', RecommendationController.getRecommendations);
router.post('/recommendations/complementaryProducts', RecommendationController.getCartRecommendations);
router.post('/recommendations/productRecipes', RecommendationController.getRecipeRecommendations);

module.exports = router;
