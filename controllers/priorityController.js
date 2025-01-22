// controllers/priorityController.js
const Priority = require("../models/priorityModel");

exports.getAllPriorities = async (req, res) => {
  try {
    const priorities = await Priority.getAllPriorities();
    res.status(200).json({ status: true, msg: "Prioridades obtenidas exitosamente", data: priorities });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener prioridades", error: error.message });
  }
};

exports.getPriorityById = async (req, res) => {
  try {
    const priority = await Priority.getPriorityById(req.params.id);
    if (priority) {
      res.status(200).json({ status: true, msg: "Prioridad obtenida exitosamente", data: priority });
    } else {
      res.status(404).json({ status: false, msg: "Prioridad no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener la prioridad", error: error.message });
  }
};

exports.createPriority = async (req, res) => {
  try {
    const { Name } = req.body;
    
    const newPriority = await Priority.createPriority(Name);
    res.status(201).json({ status: true, msg: "Prioridad creada exitosamente", data: newPriority });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear la prioridad", error: error.message });
  }
};

exports.updatePriority = async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const { Name, PriorityID } = req.body;
    const isUpdated = await Priority.updatePriority(PriorityID, Name);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Prioridad actualizada exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Prioridad no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar la prioridad", error: error.message });
  }
};

exports.deletePriority = async (req, res) => {
  try {
    const isDeleted = await Priority.deletePriority(req.params.id);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Prioridad eliminada exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Prioridad no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar la prioridad", error: error.message });
  }
};
