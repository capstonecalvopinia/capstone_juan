// controllers/paymentTypeController.js
const PaymentType = require("../models/paymentTypeModel");

exports.getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.getAllPaymentTypes();
    res.status(200).json({ status: true, msg: "Tipos de pago obtenidos exitosamente", data: paymentTypes });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener tipos de pago", error: error.message });
  }
};

exports.getPaymentTypeById = async (req, res) => {
  try {
    const paymentType = await PaymentType.getPaymentTypeById(req.params.id);
    if (paymentType) {
      res.status(200).json({ status: true, msg: "Tipo de pago obtenido exitosamente", data: paymentType });
    } else {
      res.status(404).json({ status: false, msg: "Tipo de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener el tipo de pago", error: error.message });
  }
};

exports.createPaymentType = async (req, res) => {
  try {
    const { name } = req.body;
    const newPaymentType = await PaymentType.createPaymentType(name);
    res.status(201).json({ status: true, msg: "Tipo de pago creado exitosamente", data: newPaymentType });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear el tipo de pago", error: error.message });
  }
};

exports.updatePaymentType = async (req, res) => {
  try {
    const { name } = req.body;
    const isUpdated = await PaymentType.updatePaymentType(req.params.id, name);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Tipo de pago actualizado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Tipo de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar el tipo de pago", error: error.message });
  }
};

exports.deletePaymentType = async (req, res) => {
  try {
    const isDeleted = await PaymentType.deletePaymentType(req.params.id);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Tipo de pago eliminado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Tipo de pago no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar el tipo de pago", error: error.message });
  }
};
