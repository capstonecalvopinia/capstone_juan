// controllers/discountController.js
const DiscountModel = require("../models/discountModel.js");

class DiscountController {
  // Método para obtener todos los descuentos
  static async getAllDiscounts(req, res) {
    try {
      const discounts = await DiscountModel.getAllDiscounts();
      res.json(discounts);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener los descuentos", error });
    }
  }

  // Método para crear un nuevo descuento
  static async createDiscount(req, res) {
    const { ProductID, DiscountPercentage, StartDate, EndDate } = req.body;

    if (!ProductID || !DiscountPercentage || !StartDate || !EndDate) {
      return res.status(422).json({
        msg: "Todos los campos son obligatorios: ProductID, DiscountPercentage, StartDate y EndDate",
      });
    }

    try {
      const discountData = { ProductID, DiscountPercentage, StartDate, EndDate };
      const result = await DiscountModel.createDiscount(discountData);

      if (result.success) {
        res.status(201).json({
          msg: "Descuento creado exitosamente",
        });
      } else {
        res.status(500).json({ msg: result.message, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al crear el descuento", error: error.message });
    }
  }

  // Método para obtener un descuento por su ID
  static async getDiscountById(req, res) {
    const { id } = req.params;

    try {
      const result = await DiscountModel.getDiscountById(id);

      if (result.success) {
        res.json(result.discount);
      } else {
        res.status(404).json({ msg: result.message });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el descuento", error: error.message });
    }
  }

  // Método para obtener descuentos activos por ProductID
  static async getActiveDiscountsByProductId(req, res) {
    const { productId } = req.params;

    try {
      const result = await DiscountModel.getActiveDiscountsByProductId(productId);

      if (result.success) {
        res.json(result.discounts);
      } else {
        res.status(404).json({ msg: result.message });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener descuentos activos", error: error.message });
    }
  }

  // Método para eliminar un descuento
  static async deleteDiscount(req, res) {
    const { id } = req.params;

    try {
      const result = await DiscountModel.deleteDiscount(id);

      if (result.success) {
        res.status(200).json({ msg: "Descuento eliminado exitosamente" });
      } else {
        res.status(500).json({ msg: result.message, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar el descuento", error: error.message });
    }
  }
}

module.exports = DiscountController;
