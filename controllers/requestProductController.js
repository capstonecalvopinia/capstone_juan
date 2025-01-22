// controllers/requestProductController.js
const RequestProduct = require("../models/requestProductModel");

exports.getAllRequestProducts = async (req, res) => {
  try {
    const requestProducts = await RequestProduct.getAllRequestProducts();
    res.status(200).json({ status: true, msg: "Productos de las solicitudes obtenidos exitosamente", data: requestProducts });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener los productos de las solicitudes", error: error.message });
  }
};

exports.getRequestProductById = async (req, res) => {
  try {
    const { productID, requestID } = req.params;
    const requestProduct = await RequestProduct.getRequestProductById(productID, requestID);
    if (requestProduct) {
      res.status(200).json({ status: true, msg: "Producto de la solicitud obtenido exitosamente", data: requestProduct });
    } else {
      res.status(404).json({ status: false, msg: "Producto de la solicitud no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al obtener el producto de la solicitud", error: error.message });
  }
};

exports.createRequestProduct = async (req, res) => {
  try {
    const { productID, requestID, quantity } = req.body;

    const isCreated = await RequestProduct.createRequestProduct(productID, requestID, quantity);
    if (isCreated) {
      res.status(201).json({ status: true, msg: "Producto de la solicitud creado exitosamente" });
    } else {
      res.status(400).json({ status: false, msg: "Error al crear el producto de la solicitud" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al crear el producto de la solicitud", error: error.message });
  }
};

exports.updateRequestProduct = async (req, res) => {
  try {
    const { productID, requestID, quantity } = req.body;
    const isUpdated = await RequestProduct.updateRequestProduct(productID, requestID, quantity);
    if (isUpdated) {
      res.status(200).json({ status: true, msg: "Producto de la solicitud actualizado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Producto de la solicitud no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al actualizar el producto de la solicitud", error: error.message });
  }
};

exports.deleteRequestProduct = async (req, res) => {
  try {
    const { productID, requestID } = req.params;
    const isDeleted = await RequestProduct.deleteRequestProduct(productID, requestID);
    if (isDeleted) {
      res.status(200).json({ status: true, msg: "Producto de la solicitud eliminado exitosamente" });
    } else {
      res.status(404).json({ status: false, msg: "Producto de la solicitud no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Error al eliminar el producto de la solicitud", error: error.message });
  }
};
