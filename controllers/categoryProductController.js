// controllers/categoryProductController.js
const CategoryProduct = require("../models/categoryProductModel");

const categoryProductController = {
  // Obtener todos los productos de una categoría
  async getProductsByCategory(req, res) {
    const { categoryId } = req.params;
    try {
      const products = await CategoryProduct.getProductsByCategory(categoryId);
      res.status(200).json({
        status: true,
        data: products,
        msg: "Productos obtenidos con éxito",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al obtener los productos de la categoría",
        error: error.message,
      });
    }
  },

  // Obtener todas las categorías de un producto
  async getCategoriesByProduct(req, res) {
    const { productId } = req.params;
    try {
      const categories = await CategoryProduct.getCategoriesByProduct(productId);
      res.status(200).json({
        status: true,
        data: categories,
        msg: "Categorías obtenidas con éxito",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al obtener las categorías del producto",
        error: error.message,
      });
    }
  },

  // Crear una nueva relación entre Producto y Categoría
  async createCategoryProduct(req, res) {
    const { productId, categoryId } = req.body;
    try {
      await CategoryProduct.createCategoryProduct(productId, categoryId);
      res.status(201).json({
        status: true,
        msg: "Relación creada exitosamente entre el producto y la categoría",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al crear la relación entre el producto y la categoría",
        error: error.message,
      });
    }
  },

  // Eliminar una relación entre Producto y Categoría
  async deleteCategoryProduct(req, res) {
    const { productId, categoryId } = req.params;
    try {
      await CategoryProduct.deleteCategoryProduct(productId, categoryId);
      res.status(200).json({
        status: true,
        msg: "Relación eliminada exitosamente entre el producto y la categoría",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al eliminar la relación entre el producto y la categoría",
        error: error.message,
      });
    }
  }
};

module.exports = categoryProductController;
