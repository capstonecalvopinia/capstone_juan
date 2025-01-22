const { databaseInstance, sql } = require("../config/dbConfig.js");

class UnitModel {
  // Obtener todas las unidades
  static async getAllUnits() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [Unit]");
    console.log("result.recordset: ", result.recordset);
    return result.recordset;
  }

  // Obtener una unidad por ID
  static async getUnitById(unitId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("UnitID", sql.Int, unitId)
        .query("SELECT * FROM [Unit] WHERE UnitID = @UnitID");

      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error al obtener la unidad por ID:", error);
      throw new Error("Error al obtener la unidad");
    }
  }

  // Crear una nueva unidad
  static async createUnit(unitData) {
    const { Name, ShortName } = unitData;
    try {
      const pool = await databaseInstance.getConnection();
      await pool
        .request()
        .input("Name", sql.VarChar(50), Name)
        .input("ShortName", sql.VarChar(50), ShortName)
        .query(
          "INSERT INTO [Unit] (Name, ShortName) VALUES (@Name, @ShortName)"
        );

      return { success: true, message: "Unidad creada exitosamente" };
    } catch (error) {
      console.error("Error al crear la unidad:", error);
      return {
        success: false,
        message: "Error al crear la unidad",
        error: error.message,
      };
    }
  }

  // Actualizar una unidad
  static async updateUnit(UnitID, updatedData) {
    const { Name, ShortName } = updatedData;
    console.log("updateUnit: Name: ", Name, " Shortname: ", ShortName, " unitId: ", UnitID);
    try {
      const pool = await databaseInstance.getConnection();
      await pool
        .request()
        .input("UnitID", sql.Int, UnitID)
        .input("Name", sql.VarChar(50), Name)
        .input("ShortName", sql.VarChar(50), ShortName)
        .query(
          "UPDATE [Unit] SET Name = @Name, ShortName = @ShortName WHERE UnitID = @UnitID"
        );

      return { success: true, message: "Unidad actualizada exitosamente" };
    } catch (error) {
      console.error("Error al actualizar la unidad:", error);
      return {
        success: false,
        message: "Error al actualizar la unidad",
        error: error.message,
      };
    }
  }

  // Eliminar una unidad
  static async deleteUnit(unitId) {
    
    try {
      const pool = await databaseInstance.getConnection();
      await pool
        .request()
        .input("UnitID", sql.Int, unitId)
        .query("DELETE FROM [Unit] WHERE UnitID = @UnitID");

      return { success: true, message: "Unidad eliminada exitosamente" };
    } catch (error) {
      console.error("Error al eliminar la unidad:", error);
      return {
        success: false,
        message: "Error al eliminar la unidad",
        error: error.message,
      };
    }
  }
}

module.exports = UnitModel;
