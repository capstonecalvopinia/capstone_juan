// models/requestProductModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class RequestProduct {
  constructor(productID, requestID, quantity) {
    this.productID = productID;
    this.requestID = requestID;
    this.quantity = quantity;
  }

  static async getAllRequestProducts() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM RequestProduct");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener los productos de las solicitudes: " + error.message);
      throw new Error("Error al obtener los productos de las solicitudes: " + error.message);
    }
  }

  static async getRequestProductById(productID, requestID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("RequestID", sql.Int, requestID)
        .query("SELECT * FROM RequestProduct WHERE ProductID = @ProductID AND RequestID = @RequestID");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener el producto de la solicitud: " + error.message);
      throw new Error("Error al obtener el producto de la solicitud: " + error.message);
    }
  }

  static async createRequestProduct(productID, requestID, quantity) {
    console.log("createRequestProduct: ", productID, requestID, quantity);
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("RequestID", sql.Int, requestID)
        .input("Quantity", sql.Int, quantity)
        .query(
          "INSERT INTO RequestProduct (ProductID, RequestID, Quantity) VALUES (@ProductID, @RequestID, @Quantity)"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al crear el producto de la solicitud: ", error.message);
      throw new Error("Error al crear el producto de la solicitud: ", error.message);
    }
  }

  static async updateRequestProduct(productID, requestID, quantity) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("RequestID", sql.Int, requestID)
        .input("Quantity", sql.Int, quantity)
        .query(
          "UPDATE RequestProduct SET Quantity = @Quantity WHERE ProductID = @ProductID AND RequestID = @RequestID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar el producto de la solicitud: " + error.message);
      throw new Error("Error al actualizar el producto de la solicitud: " + error.message);
    }
  }

  static async deleteRequestProduct(productID, requestID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("RequestID", sql.Int, requestID)
        .query(
          "DELETE FROM RequestProduct WHERE ProductID = @ProductID AND RequestID = @RequestID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar el producto de la solicitud: " + error.message);
      throw new Error("Error al eliminar el producto de la solicitud: " + error.message);
    }
  }
}

module.exports = RequestProduct;
