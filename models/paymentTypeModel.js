// models/paymentTypeModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class PaymentType {
  constructor(paymentTypeID, name) {
    this.paymentTypeID = paymentTypeID;
    this.name = name;
  }

  static async getAllPaymentTypes() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM PaymentType");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener los tipos de pago: " + error.message);
      throw new Error("Error al obtener los tipos de pago: " + error.message);
    }
  }

  static async getPaymentTypeById(paymentTypeID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentTypeID", sql.Int, paymentTypeID)
        .query("SELECT * FROM PaymentType WHERE PaymentTypeID = @PaymentTypeID");

      return result.recordset[0];
    } catch (error) {
      throw new Error("Error al obtener el tipo de pago: " + error.message);
    }
  }

  static async createPaymentType(name) {
    try {
      console.log("name: ", name);
      name = name.Name;
      console.log("name: ", name);
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Name", sql.Text, name)
        .query("INSERT INTO PaymentType (Name) VALUES (@Name)");
      console.log("result: ", result);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error al crear el tipo de pago: " + error.message);
      throw new Error("Error al crear el tipo de pago: " + error.message);
    }
  }

  static async updatePaymentType(paymentTypeID, name) {
    try {
      name = name.Name;
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentTypeID", sql.Int, paymentTypeID)
        .input("Name", sql.VarChar, name)
        .query("UPDATE PaymentType SET Name = @Name WHERE PaymentTypeID = @PaymentTypeID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar el tipo de pago: " + error.message);
      throw new Error("Error al actualizar el tipo de pago: " + error.message);
    }
  }

  static async deletePaymentType(paymentTypeID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentTypeID", sql.Int, paymentTypeID)
        .query("DELETE FROM PaymentType WHERE PaymentTypeID = @PaymentTypeID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error("Error al eliminar el tipo de pago: " + error.message);
    }
  }
}

module.exports = PaymentType;
