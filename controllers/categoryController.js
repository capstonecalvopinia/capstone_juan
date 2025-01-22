// controllers/categoryController.js
const Category = require('../models/categoryModel');

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json({ status: true, data: categories });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.getCategoryById(categoryId);
    if (category) {
      res.status(200).json({ status: true, data: category });
    } else {
      res.status(404).json({ status: false, msg: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const created = await Category.createCategory(name, description);
    if (created) {
      res.status(201).json({ status: true, msg: 'Category created successfully' });
    } else {
      res.status(400).json({ status: false, msg: 'Failed to create category' });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Actualizar una categoría
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  try {
    const updated = await Category.updateCategory(categoryId, name, description);
    if (updated) {
      res.status(200).json({ status: true, msg: 'Category updated successfully' });
    } else {
      res.status(404).json({ status: false, msg: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deleted = await Category.deleteCategory(categoryId);
    if (deleted) {
      res.status(200).json({ status: true, msg: 'Category deleted successfully' });
    } else {
      res.status(404).json({ status: false, msg: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
