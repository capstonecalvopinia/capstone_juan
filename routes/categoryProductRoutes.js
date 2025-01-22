// routes/categoryProductRoutes.js
const express = require("express");
const router = express.Router();
const categoryProductController = require("../controllers/categoryProductController");

// Obtener todos los productos de una categoría
router.get("/category/:categoryId/products", categoryProductController.getProductsByCategory);

// Obtener todas las categorías de un producto
router.get("/product/:productId/categories", categoryProductController.getCategoriesByProduct);

// Crear una relación entre Producto y Categoría
router.post("/category-product", categoryProductController.createCategoryProduct);

// Eliminar una relación entre Producto y Categoría
router.delete("/category-product/:productId/:categoryId", categoryProductController.deleteCategoryProduct);

module.exports = router;
