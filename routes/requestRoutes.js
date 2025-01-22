// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Rutas para manejar los pedidos
router.get('/requests', requestController.getAllRequests);           // Obtener todos los pedidos
router.get('/requests/:requestId', requestController.getRequestById); // Obtener un pedido por ID
router.get('/requests/user/:userId', requestController.getRequestsByUserId); // Obtener todos los pedidos de un usuario por UserID
router.post('/requests', requestController.createRequest);          // Crear un nuevo pedido
router.post('/requests/requestPaymentVerify', requestController.requestPaymentVerify);   
router.post('/requests/payWithPaypal', requestController.payWithPaypal);          // Para pagar
router.post('/requests/capturePaypalPayment/:orderID', requestController.capturePaypalPayment);          // Para capturar
router.put('/requests/:requestId', requestController.updateRequest); // Actualizar un pedido
router.put('/requests/updatePaymentState/:requestId', requestController.updateRequestPaymentState); // Actualizar un el estado de pago y estado de pedido 
router.delete('/requests/:requestId', requestController.deleteRequest); // Eliminar un pedido

module.exports = router;
