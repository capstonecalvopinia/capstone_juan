// controllers/requestStateController.js
const requestStateModel = require('../models/requestStateModel');

async function getAllRequestStates(req, res) {
  try {
    const requestStates = await requestStateModel.getAllRequestStates();
    res.status(200).json({ status: true, data: requestStates });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener estados de solicitud", error: error.message });
  }
}

async function getRequestStateById(req, res) {
  try {
    const requestState = await requestStateModel.getRequestStateById(req.params.id);
    if (requestState) {
      res.status(200).json({ status: true, data: requestState });
    } else {
      res.status(404).json({ status: false, msg: "Estado de solicitud no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener estado de solicitud", error: error.message });
  }
}

async function createRequestState(req, res) {
  try {
    const newRequestState = await requestStateModel.createRequestState(req.body);
    res.status(201).json({ status: true, msg: "Estado de solicitud creado exitosamente", requestStateID: newRequestState.RequestStateID });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear estado de solicitud", error: error.message });
  }
}

async function updateRequestState(req, res) {
  try {
    const updatedRequestState = await requestStateModel.updateRequestState(req.params.id, req.body);
    res.status(200).json({ status: true, msg: "Estado de solicitud actualizado exitosamente", data: updatedRequestState });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar estado de solicitud", error: error.message });
  }
}

async function deleteRequestState(req, res) {
  try {
    await requestStateModel.deleteRequestState(req.params.id);
    res.status(200).json({ status: true, msg: "Estado de solicitud eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar estado de solicitud", error: error.message });
  }
}

module.exports = {
  getAllRequestStates,
  getRequestStateById,
  createRequestState,
  updateRequestState,
  deleteRequestState,
};
