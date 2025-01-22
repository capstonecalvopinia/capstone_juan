const express = require("express");
const router = express.Router();
const RecipeController = require("../controllers/recipeController");

// Ruta para obtener todas las recetas
router.get("/recipes", RecipeController.getAllRecipes);

// Ruta para obtener una receta por ID
router.get("/recipes/:id", RecipeController.getRecipeById);

// Ruta para crear una nueva receta
router.post("/recipes", RecipeController.createRecipe);

// Ruta para actualizar una receta
router.put("/recipes/:id", RecipeController.updateRecipe);

// Ruta para eliminar una receta
router.delete("/recipes/:id", RecipeController.deleteRecipe);

module.exports = router;
