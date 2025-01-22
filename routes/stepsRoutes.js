const express = require('express');
const router = express.Router();
const StepsController = require('../controllers/stepsController');

// Ruta para obtener todos los pasos
router.get('/steps', StepsController.getAllSteps);

// Ruta para obtener un paso por ID
router.get('/steps/:id', StepsController.getStepById);

// Ruta para obtener los pasos por RecipeID
router.get('/steps/recipe/:recipeID', StepsController.getStepsByRecipeId);

// Ruta para crear un nuevo paso
router.post('/steps', StepsController.createStep);

// Ruta para actualizar un paso
router.put('/steps/:id', StepsController.updateStep);

// Ruta para eliminar un paso
router.delete('/steps/:id', StepsController.deleteStep);

module.exports = router;

