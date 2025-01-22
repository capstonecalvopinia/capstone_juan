const Recipe = require("../models/recipeModel");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.getAllRecipes();
    res.status(200).json({ status: true, msg: "Recetas obtenidas exitosamente", data: recipes });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener las recetas", error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.getRecipeById(req.params.id);
    if (recipe) {
      res.status(200).json({ status: true, msg: "Receta obtenida exitosamente", data: recipe });
    } else {
      res.status(404).json({ status: false, msg: "Receta no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener la receta", error: error.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { name, description, preparationTime, cookingTime, quantity, portions, calories } = req.body;
    const newRecipe = await Recipe.createRecipe(name, description, preparationTime, cookingTime, quantity, portions, calories);
    res.status(201).json({ status: true, msg: "Receta creada exitosamente", data: newRecipe });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear la receta", error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { name, description, preparationTime, cookingTime, quantity, portions, calories } = req.body;
    const isUpdated = await Recipe.updateRecipe(req.params.id, name, description, preparationTime, cookingTime, quantity, portions, calories);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Receta actualizada exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Receta no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar la receta", error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const isDeleted = await Recipe.deleteRecipe(req.params.id);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Receta eliminada exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Receta no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar la receta", error: error.message });
  }
};
