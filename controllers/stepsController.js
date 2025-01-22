const Step = require("../models/stepsModel.js"); // Asegúrate de que el modelo esté correctamente importado

// Obtener todos los pasos
exports.getAllSteps = async (req, res) => {
  try {
    const steps = await Step.getAllSteps();
    res.status(200).json({ status: true, msg: "Pasos obtenidos exitosamente", data: steps });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener los pasos", error: error.message });
  }
};

// Obtener un paso por ID
exports.getStepById = async (req, res) => {
  try {
    const step = await Step.getStepById(req.params.id);
    if (step) {
      res.status(200).json({ status: true, msg: "Paso obtenido exitosamente", data: step });
    } else {
      res.status(404).json({ status: false, msg: "Paso no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener el paso", error: error.message });
  }
};

// Obtener pasos por RecipeID
exports.getStepsByRecipeId = async (req, res) => {
  try {
    const { recipeID } = req.params;
    const steps = await Step.getStepsByRecipeId(recipeID); // Llamar al método correspondiente del modelo
    if (steps.length > 0) {
      res.status(200).json({ status: true, msg: "Pasos obtenidos exitosamente", data: steps });
    } else {
      res.status(404).json({ status: false, msg: "No se encontraron pasos para esta receta" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener los pasos por RecipeID", error: error.message });
  }
};

// Crear un nuevo paso
exports.createStep = async (req, res) => {
  try {
    const { name, description, time, numberOfStep, recipeID } = req.body;
    const newStep = await Step.createStep(name, description, time, numberOfStep, recipeID);
    res.status(201).json({ status: true, msg: "Paso creado exitosamente", data: newStep });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear el paso", error: error.message });
  }
};

// Actualizar un paso
exports.updateStep = async (req, res) => {
  try {
    const { name, description, time, numberOfStep, recipeID } = req.body;
    const isUpdated = await Step.updateStep(req.params.id, name, description, time, numberOfStep, recipeID);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Paso actualizado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Paso no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar el paso", error: error.message });
  }
};

// Eliminar un paso
exports.deleteStep = async (req, res) => {
  try {
    const isDeleted = await Step.deleteStep(req.params.id);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Paso eliminado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Paso no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar el paso", error: error.message });
  }
};
