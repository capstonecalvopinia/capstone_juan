// models/paymentStateModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class PaymentState {
  constructor(paymentStateID, name) {
    this.paymentStateID = paymentStateID;
    this.name = name;
  }

  static async getAllPaymentStates() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM PaymentState");
      return result.recordset;
    } catch (error) {
      throw new Error("Error al obtener los estados de pago: " + error.message);
    }
  }

  static async getPaymentStateById(paymentStateID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentStateID", sql.Int, paymentStateID)
        .query("SELECT * FROM PaymentState WHERE PaymentStateID = @PaymentStateID");

      return result.recordset[0];
    } catch (error) {
      throw new Error("Error al obtener el estado de pago: " + error.message);
    }
  }

  static async createPaymentState(name) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Name", sql.VarChar, name)
        .query("INSERT INTO PaymentState (Name) OUTPUT INSERTED.* VALUES (@Name)");

      return result.recordset[0];
    } catch (error) {
      throw new Error("Error al crear el estado de pago: " + error.message);
    }
  }

  static async updatePaymentState(paymentStateID, name) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentStateID", sql.Int, paymentStateID)
        .input("Name", sql.VarChar, name)
        .query("UPDATE PaymentState SET Name = @Name WHERE PaymentStateID = @PaymentStateID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error("Error al actualizar el estado de pago: " + error.message);
    }
  }

  static async deletePaymentState(paymentStateID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PaymentStateID", sql.Int, paymentStateID)
        .query("DELETE FROM PaymentState WHERE PaymentStateID = @PaymentStateID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error("Error al eliminar el estado de pago: " + error.message);
    }
  }
}

module.exports = PaymentState;
