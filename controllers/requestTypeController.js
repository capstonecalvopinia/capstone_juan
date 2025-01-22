// controllers/requestTypeController.js
const RequestTypeModel = require('../models/requestTypeModel');

class RequestTypeController {
  // Método para obtener todos los tipos de solicitud
  static async getAllRequestTypes(req, res) {
    console.log("getAllRequestTypes");
    try {
      const requestTypes = await RequestTypeModel.getAll();
      console.log("requestTypes: ", requestTypes);
      // res.json(requestTypes);
      res.status(200).json({ status: true, data: requestTypes, msg: "Consulta exitosa" });
    } catch (error) {
      console.error("Error al obtener los tipos de solicitud: ", error.message);
      res.status(500).json({ status: false, msg: "Error al obtener los tipos de solicitud", error: error.message });
      // res.status(500).json({ msg: "Error al obtener los tipos de solicitud", error: error.message });
    }
  }

  // Método para registrar un nuevo tipo de solicitud
  static async registerRequestType(req, res) {
    try {
      const { Name, Description } = req.body;

      if (!Name) {
        return res.status(422).json({ msg: "El nombre es obligatorio" });
      }

      const newRequestType = { Name, Description };

      const result = await RequestTypeModel.create(newRequestType);

      if (result) {
        res.status(201).json({
          status: true,
          msg: "Tipo de solicitud registrado exitosamente",
          requestTypeID: result.RequestTypeID,
        });
      } else {
        res.status(500).json({ msg: "Error al registrar el tipo de solicitud" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al registrar el tipo de solicitud", error: error.message });
    }
  }

  // Método para obtener un tipo de solicitud por su ID
  static async getRequestTypeById(req, res) {
    const { id } = req.params;
    try {
      const requestType = await RequestTypeModel.getById(id);
      if (!requestType) {
        return res.status(404).json({ msg: "Tipo de solicitud no encontrado" });
      }
      res.json(requestType);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el tipo de solicitud", error: error.message });
    }
  }

  // Método para actualizar un tipo de solicitud
  static async updateRequestType(req, res) {
    const { id } = req.params;
    const { Name, Description } = req.body;

    if (!Name) {
      return res.status(422).json({ msg: "El nombre es obligatorio" });
    }

    try {
      const updatedRequestType = { Name, Description };

      const result = await RequestTypeModel.update(id, updatedRequestType);

      if (result) {
        res.status(200).json({ msg: "Tipo de solicitud actualizado exitosamente" });
      } else {
        res.status(500).json({ msg: "Error al actualizar el tipo de solicitud" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al actualizar el tipo de solicitud", error: error.message });
    }
  }

  // Método para eliminar un tipo de solicitud
  static async deleteRequestType(req, res) {
    console.log("req.params deleteRequestType: ", req);
    const { id } = req.params;
    try {
      
      const result = await RequestTypeModel.delete(id);

      if (result.status) {
        res.status(200).json({ msg: "Tipo de solicitud eliminado exitosamente", status: true });
      } else {
        res.status(500).json({ msg: "Error al eliminar el tipo de solicitud", status: false });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar el tipo de solicitud", error: error.message, status: false });
    }
  }
}

module.exports = RequestTypeController;
