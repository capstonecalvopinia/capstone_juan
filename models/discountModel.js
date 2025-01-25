// models/discountModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

class DiscountModel {
  // Método para obtener todos los descuentos
  static async getAllDiscounts() {
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT *
      FROM Discount
    `;

    const result = await pool.request().query(query);
    return result.recordset;
  }

  // Método para crear un nuevo descuento
  static async createDiscount(discountData) {
    const { ProductID, DiscountPercentage, StartDate, EndDate } = discountData;

    try {
      const pool = await databaseInstance.getConnection();

      await pool
        .request()
        .input("ProductID", sql.Int, ProductID)
        .input("DiscountPercentage", sql.Decimal(5, 2), DiscountPercentage)
        .input("StartDate", sql.Date, StartDate)
        .input("EndDate", sql.Date, EndDate).query(`
          INSERT INTO Discount (ProductID, DiscountPercentage, StartDate, EndDate)
          VALUES (@ProductID, @DiscountPercentage, @StartDate, @EndDate)
        `);

      return { success: true, message: "Descuento creado exitosamente" };
    } catch (error) {
      console.error("Error al crear el descuento:", error);
      return {
        success: false,
        message: "Error al crear el descuento",
        error: error.message,
      };
    }
  }

  // Método para obtener un descuento por su ID
  static async getDiscountById(discountID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().input("DiscountID", sql.Int, discountID).query(`
        SELECT *
        FROM Discount
        WHERE DiscountID = @DiscountID
      `);

      const discount = result.recordset[0];

      if (!discount) {
        return { success: false, message: "Descuento no encontrado" };
      }

      return { success: true, discount: discount };
    } catch (error) {
      console.error("Error al obtener el descuento:", error);
      return {
        success: false,
        message: "Error al obtener el descuento",
        error: error.message,
      };
    }
  }

  // Método para obtener descuentos activos por ProductID
  static async getActiveDiscountsByProductId(productID) {
    try {
      const pool = await databaseInstance.getConnection();
      const query = `
        SELECT *
        FROM Discount
        WHERE ProductID = @ProductID
          AND StartDate <= GETDATE()
          AND EndDate >= GETDATE()
      `;

      const result = await pool.request().input("ProductID", sql.Int, productID).query(query);

      if (result.recordset.length === 0) {
        return { success: false, message: "No hay descuentos activos para este producto" };
      }

      return { success: true, discounts: result.recordset };
    } catch (error) {
      console.error("Error al obtener descuentos activos:", error);
      return {
        success: false,
        message: "Error al obtener descuentos activos",
        error: error.message,
      };
    }
  }

  // Método para eliminar un descuento
  static async deleteDiscount(discountID) {
    try {
      const pool = await databaseInstance.getConnection();
      await pool.request().input("DiscountID", sql.Int, discountID).query(`
        DELETE FROM Discount
        WHERE DiscountID = @DiscountID
      `);

      return { success: true, message: "Descuento eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar el descuento:", error);
      return {
        success: false,
        message: "Error al eliminar el descuento",
        error: error.message,
      };
    }
  }
}

module.exports = DiscountModel;
