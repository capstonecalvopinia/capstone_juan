// routes/discountRoutes.js
const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/discountController');

// Ruta para obtener todos los descuentos
router.get('/discounts', DiscountController.getAllDiscounts);

// Ruta para crear un nuevo descuento
router.post('/discounts/register', DiscountController.createDiscount);

// Ruta para obtener un descuento por su ID
router.get('/discounts/:id', DiscountController.getDiscountById);

// Ruta para obtener descuentos activos por ProductID
router.get('/discounts/active/:productId', DiscountController.getActiveDiscountsByProductId);

// Ruta para eliminar un descuento por su ID
router.delete('/discounts/:id', DiscountController.deleteDiscount);

// Ruta para actualizar un descuento por su ID
router.put('/discounts/:id', DiscountController.updateDiscount);


module.exports = router;
