// routes/paymentStateRoutes.js
const express = require("express");
const router = express.Router();
const PaymentStateController = require("../controllers/paymentStateController");

// Ruta para obtener todos los estados de pago
router.get("/payment-states", PaymentStateController.getAllPaymentStates);

// Ruta para obtener un estado de pago por ID
router.get("/payment-states/:id", PaymentStateController.getPaymentStateById);

// Ruta para crear un nuevo estado de pago
router.post("/payment-states", PaymentStateController.createPaymentState);

// Ruta para actualizar un estado de pago
router.put("/payment-states/:id", PaymentStateController.updatePaymentState);

// Ruta para eliminar un estado de pago
router.delete("/payment-states/:id", PaymentStateController.deletePaymentState);

module.exports = router;
