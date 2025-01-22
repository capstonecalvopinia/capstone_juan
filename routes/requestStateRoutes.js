// routes/requestStateRoutes.js
const express = require('express');
const router = express.Router();
const requestStateController = require('../controllers/requestStateController');

// Ruta para obtener todos los estados de solicitud
router.get('/request-states', requestStateController.getAllRequestStates);

// Ruta para crear un nuevo estado de solicitud
router.post('/request-states', requestStateController.createRequestState);

// Ruta para obtener un estado de solicitud por ID
router.get('/request-states/:id', requestStateController.getRequestStateById);

// Ruta para actualizar un estado de solicitud
router.put('/request-states/:id', requestStateController.updateRequestState);

// Ruta para eliminar un estado de solicitud
router.delete('/request-states/:id', requestStateController.deleteRequestState);

module.exports = router;
