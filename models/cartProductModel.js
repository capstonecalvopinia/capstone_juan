// models/CartProductModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class CartProduct {
  constructor(productID, cartID, quantity) {
    this.productID = productID;
    this.cartID = cartID;
    this.quantity = quantity;
  }

  static async getAllCartProducts() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM CartProduct");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener los productos de las solicitudes: " + error.message);
      throw new Error("Error al obtener los productos de las solicitudes: " + error.message);
    }
  }

  static async getCartProductById(productID, cartID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("CartID", sql.Int, cartID)
        .query("SELECT * FROM CartProduct WHERE ProductID = @ProductID AND CartID = @CartID");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener el producto de la solicitud: " + error.message);
      throw new Error("Error al obtener el producto de la solicitud: " + error.message);
    }
  }

  static async createCartProduct(productID, cartID, quantity) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("CartID", sql.Int, cartID)
        .input("Quantity", sql.Int, quantity)
        .query(
          "INSERT INTO CartProduct (ProductID, CartID, Quantity) VALUES (@ProductID, @CartID, @Quantity)"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al crear el producto de la solicitud: " + error.message);
      throw new Error("Error al crear el producto de la solicitud: " + error.message);
    }
  }

  static async updateCartProduct(productID, cartID, quantity) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("CartID", sql.Int, cartID)
        .input("Quantity", sql.Int, quantity)
        .query(
          "UPDATE CartProduct SET Quantity = @Quantity WHERE ProductID = @ProductID AND CartID = @CartID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar el producto de la solicitud: " + error.message);
      throw new Error("Error al actualizar el producto de la solicitud: " + error.message);
    }
  }

  static async deleteCartProduct(productID, cartID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("CartID", sql.Int, cartID)
        .query(
          "DELETE FROM CartProduct WHERE ProductID = @ProductID AND CartID = @CartID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar el producto de la solicitud: " + error.message);
      throw new Error("Error al eliminar el producto de la solicitud: " + error.message);
    }
  }

  static async deleteByCartId(cartID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CartID", sql.Int, cartID)
        .query(
          "DELETE FROM CartProduct WHERE CartID = @CartID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar el producto de la solicitud: " + error.message);
      throw new Error("Error al eliminar el producto de la solicitud: " + error.message);
    }
  }
}

module.exports = CartProduct;
