// routes/paymentTypeRoutes.js
const express = require('express');
const router = express.Router();
const PaymentTypeController = require('../controllers/paymentTypeController');

// Ruta para obtener todos los tipos de pago
router.get('/payment-types', PaymentTypeController.getAllPaymentTypes);

// Ruta para obtener un tipo de pago por ID
router.get('/payment-types/:id', PaymentTypeController.getPaymentTypeById);

// Ruta para crear un nuevo tipo de pago
router.post('/payment-types', PaymentTypeController.createPaymentType);

// Ruta para actualizar un tipo de pago
router.put('/payment-types/:id', PaymentTypeController.updatePaymentType);

// Ruta para eliminar un tipo de pago
router.delete('/payment-types/:id', PaymentTypeController.deletePaymentType);

module.exports = router;
