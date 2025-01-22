// routes/unitRoutes.js
const express = require('express');
const router = express.Router();
const UnitController = require('../controllers/unitController');

// Ruta para obtener todas las unidades
router.get('/units', UnitController.getAllUnits);

// Ruta para crear una nueva unidad
router.post('/units', UnitController.createUnit);

// Ruta para obtener una unidad por ID
router.get('/units/:id', UnitController.getUnitById);

// Ruta para actualizar una unidad por ID
router.put('/units/:id', UnitController.updateUnit);

// Ruta para eliminar una unidad por ID
router.delete('/units/:id', UnitController.deleteUnit);

module.exports = router;
