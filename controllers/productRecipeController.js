// controllers/productRecipeController.js
const ProductRecipe = require('../models/productRecipeModel');

// Obtener todas las relaciones entre productos y recetas
const getAllProductRecipes = async (req, res) => {
  try {
    const productRecipes = await ProductRecipe.getAll();
    res.status(200).json({
      status: true,
      msg: "Relaciones entre productos y recetas obtenidas exitosamente",
      data: productRecipes
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al obtener las relaciones entre productos y recetas",
      error: error.message
    });
  }
};

// Obtener una relación específica entre un producto y receta
const getProductRecipe = async (req, res) => {
  console.log("getProductRecipe");
  const { productId, recipeId } = req.params;
  try {
    const productRecipe = await ProductRecipe.getByProductAndRecipe(productId, recipeId);
    if (productRecipe.length > 0) {
      res.status(200).json({
        status: true,
        msg: "Relación entre producto y receta obtenida exitosamente",
        data: productRecipe
      });
    } else {
      res.status(404).json({
        status: false,
        msg: "No se encontró la relación entre el producto y receta",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al obtener la relación entre el producto y receta",
      error: error.message
    });
  }
};

// Crear una nueva relación entre producto y receta
const createProductRecipe = async (req, res) => {
  const { productId, recipeId, quantity, unitId } = req.body;
  try {
    const result = await ProductRecipe.create(productId, recipeId, quantity, unitId);
    res.status(201).json({
      status: true,
      msg: result.message, // Mensaje de éxito desde el modelo
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al crear la relación entre producto y receta",
      error: error.message
    });
  }
};

// Actualizar una relación existente entre producto y receta
const updateProductRecipe = async (req, res) => {
  const { productId, recipeId, quantity, unitId } = req.body;
  try {
    const result = await ProductRecipe.update(productId, recipeId, quantity, unitId);
    res.status(200).json({
      status: true,
      msg: result.message, // Mensaje de éxito desde el modelo
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al actualizar la relación entre producto y receta",
      error: error.message
    });
  }
};

// Eliminar una relación entre producto y receta
const deleteProductRecipe = async (req, res) => {
  const { productId, recipeId } = req.params;
  try {
    const result = await ProductRecipe.delete(productId, recipeId);
    res.status(200).json({
      status: true,
      msg: result.message, // Mensaje de éxito desde el modelo
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al eliminar la relación entre producto y receta",
      error: error.message
    });
  }
};

// Obtener todas las recetas para un producto
const getRecipesForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const recipes = await ProductRecipe.getRecipesForProduct(productId);
    res.status(200).json({
      status: true,
      msg: "Recetas obtenidas exitosamente para el producto",
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al obtener las recetas para el producto",
      error: error.message
    });
  }
};

// Obtener todos los productos para una receta
const getProductsForRecipe = async (req, res) => {
  const { recipeId } = req.params;
  console.log("recipeId: ", recipeId);
  try {
    const products = await ProductRecipe.getProductsForRecipe(recipeId);
    res.status(200).json({
      status: true,
      msg: "Productos obtenidos exitosamente para la receta",
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error al obtener los productos para la receta",
      error: error.message
    });
  }
};

module.exports = {
  getAllProductRecipes,
  getProductRecipe,
  createProductRecipe,
  updateProductRecipe,
  deleteProductRecipe,
  getRecipesForProduct,
  getProductsForRecipe
};
