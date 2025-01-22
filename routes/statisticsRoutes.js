// routes/statisticsRoutes.js
const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticsController');

// Rutas para manejar las estadísticas
router.get('/statistics', StatisticsController.getAllStatistics);           // Obtener todas las estadísticas
  // Eliminar una estadística por ID

module.exports = router;
