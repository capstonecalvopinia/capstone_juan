// controllers/paymentStateController.js
const PaymentState = require("../models/paymentStateModel");

exports.getAllPaymentStates = async (req, res) => {
  try {
    const paymentStates = await PaymentState.getAllPaymentStates();
    res.status(200).json({ status: true, msg: "Estados de pago obtenidos exitosamente", data: paymentStates });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener los estados de pago", error: error.message });
  }
};

exports.getPaymentStateById = async (req, res) => {
  try {
    const paymentState = await PaymentState.getPaymentStateById(req.params.id);
    if (paymentState) {
      res.status(200).json({ status: true, msg: "Estado de pago obtenido exitosamente", data: paymentState });
    } else {
      res.status(404).json({ status: false, msg: "Estado de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener el estado de pago", error: error.message });
  }
};

exports.createPaymentState = async (req, res) => {
  try {
    const { name } = req.body;
    const newPaymentState = await PaymentState.createPaymentState(name);
    res.status(201).json({ status: true, msg: "Estado de pago creado exitosamente", data: newPaymentState });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear el estado de pago", error: error.message });
  }
};

exports.updatePaymentState = async (req, res) => {
  try {
    const { name } = req.body;
    const isUpdated = await PaymentState.updatePaymentState(req.params.id, name);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Estado de pago actualizado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Estado de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar el estado de pago", error: error.message });
  }
};

exports.deletePaymentState = async (req, res) => {
  try {
    const isDeleted = await PaymentState.deletePaymentState(req.params.id);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Estado de pago eliminado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Estado de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar el estado de pago", error: error.message });
  }
};
