// controllers/unitController.js
const UnitModel = require("../models/unitModel.js");

class UnitController {
  // Obtener todas las unidades
  static async getAllUnits(req, res) {
    try {
      const units = await UnitModel.getAllUnits();
      res.status(200).json({
        status: true,
        msg: "Unidades obtenidas exitosamente",
        units,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al obtener las unidades",
        error: error.message,
      });
    }
  }

  // Obtener una unidad por ID
  static async getUnitById(req, res) {
    const { id } = req.params;
    try {
      const unit = await UnitModel.getUnitById(id);
      if (unit) {
        res.status(200).json({
          status: true,
          msg: "Unidad obtenida exitosamente",
          unit,
        });
      } else {
        res.status(404).json({
          status: false,
          msg: "Unidad no encontrada",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al obtener la unidad",
        error: error.message,
      });
    }
  }

  // Crear una nueva unidad
  static async createUnit(req, res) {
    const { Name, ShortName } = req.body;
    console.log("create unit: req.body: ", req.body);
    try {
      const newUnit = await UnitModel.createUnit({ Name, ShortName });
      res.status(201).json({
        status: true,
        msg: "Unidad creada exitosamente",
        unitID: newUnit.unitID,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al crear la unidad",
        error: error.message,
      });
    }
  }

  // Actualizar una unidad por ID
  static async updateUnit(req, res) {
    console.log("req: ", req);
    const { UnitID, Name, ShortName } = req.body;
    try {
      const updated = await UnitModel.updateUnit(UnitID, { Name, ShortName });
      if (updated) {
        res.status(200).json({
          status: true,
          msg: "Unidad actualizada exitosamente",
        });
      } else {
        res.status(404).json({
          status: false,
          msg: "Unidad no encontrada",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al actualizar la unidad",
        error: error.message,
      });
    }
  }

  // Eliminar una unidad por ID
  static async deleteUnit(req, res) {
    const { id } = req.params;
    console.log("id:", id);
    try {
      const deleted = await UnitModel.deleteUnit(id);
      if (deleted) {
        res.status(200).json({
          status: true,
          msg: "Unidad eliminada exitosamente",
        });
      } else {
        res.status(404).json({
          status: false,
          msg: "Unidad no encontrada",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error al eliminar la unidad",
        error: error.message,
      });
    }
  }
}

module.exports = UnitController;
