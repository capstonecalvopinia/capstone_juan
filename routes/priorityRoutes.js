// routes/priorityRoutes.js
const express = require('express');
const router = express.Router();
const PriorityController = require('../controllers/priorityController');

// Ruta para obtener todas las prioridades
router.get('/priorities', PriorityController.getAllPriorities);

// Ruta para obtener una prioridad por ID
router.get('/priorities/:id', PriorityController.getPriorityById);

// Ruta para crear una nueva prioridad
router.post('/priorities', PriorityController.createPriority);

// Ruta para actualizar una prioridad
router.put('/priorities/:id', PriorityController.updatePriority);

// Ruta para eliminar una prioridad
router.delete('/priorities/:id', PriorityController.deletePriority);

module.exports = router;
