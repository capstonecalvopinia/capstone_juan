// routes/productRecipeRoutes.js
const express = require('express');
const router = express.Router();
const productRecipeController = require('../controllers/productRecipeController.js');

// Rutas adicionales para obtener las recetas de un producto y los productos de una receta
router.get('/product-recipes/recipes/:productId', productRecipeController.getRecipesForProduct); // Obtener todas las recetas para un producto
router.get('/product-recipes/products/:recipeId', productRecipeController.getProductsForRecipe); // Obtener todos los productos para una receta

// Rutas para las operaciones CRUD de ProductRecipe
router.get('/product-recipes', productRecipeController.getAllProductRecipes); // Obtener todas las relaciones entre productos y recetas
router.get('/product-recipes/:productId/:recipeId', productRecipeController.getProductRecipe); // Obtener una relación entre un producto y receta
router.post('/product-recipes', productRecipeController.createProductRecipe); // Crear una nueva relación entre producto y receta
router.put('/product-recipes', productRecipeController.updateProductRecipe); // Actualizar una relación existente entre producto y receta
router.delete('/product-recipes/:productId/:recipeId', productRecipeController.deleteProductRecipe); // Eliminar una relación entre producto y receta

module.exports = router;
