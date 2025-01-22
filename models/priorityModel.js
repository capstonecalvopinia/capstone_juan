// models/paymentTypeModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class Priority {
  constructor(priorityID, name) {
    this.priorityID = priorityID;
    this.name = name;
  }

  static async getAllPriorities() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM Priority");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener las prioridades: " + error.message);
      throw new Error("Error al obtener las prioridades: " + error.message);
    }
  }

  static async getPriorityById(priorityID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PriorityID", sql.Int, priorityID)
        .query("SELECT * FROM Priority WHERE PriorityID = @PriorityID");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener la prioridad: " + error.message);
      throw new Error("Error al obtener la prioridad: " + error.message);
    }
  }

  static async createPriority(Name) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Name", sql.VarChar, Name)
        .query("INSERT INTO Priority (Name) OUTPUT INSERTED.* VALUES (@Name)");

      return result.recordset[0];
    } catch (error) {
      console.error("Error al crear la prioridad: " + error.message);
      throw new Error("Error al crear la prioridad: " + error.message);
    }
  }

  static async updatePriority(priorityID, name) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PriorityID", sql.Int, priorityID)
        .input("Name", sql.VarChar, name)
        .query("UPDATE Priority SET Name = @Name WHERE PriorityID = @PriorityID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar la prioridad: " + error.message);
      throw new Error("Error al actualizar la prioridad: " + error.message);
    }
  }

  static async deletePriority(priorityID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("PriorityID", sql.Int, priorityID)
        .query("DELETE FROM Priority WHERE PriorityID = @PriorityID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar la prioridad: " + error.message);
      throw new Error("Error al eliminar la prioridad: " + error.message);
    }
  }
}

module.exports = Priority;
