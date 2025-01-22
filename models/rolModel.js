// models/rolModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

class RolModel {
  // Obtener todos los roles
  static async getAllRoles() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM Rol");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener roles:", error);
      return { success: false, message: "Error al obtener roles", error: error.message };
    }
  }

  // Obtener un rol por ID
  static async getRoleById(rolID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request()
        .input("RolID", sql.Int, rolID)
        .query("SELECT * FROM Rol WHERE RolID = @RolID");

      if (result.recordset.length === 0) {
        return { success: false, message: "Rol no encontrado" };
      }
      return { success: true, role: result.recordset[0] };
    } catch (error) {
      console.error("Error al obtener el rol:", error);
      return { success: false, message: "Error al obtener el rol", error: error.message };
    }
  }

  // Crear un nuevo rol
  static async createRole(roleData) {
    const { Name, Description } = roleData;

    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request()
        .input("Name", sql.VarChar(50), Name)
        .input("Description", sql.Text, Description)
        .query(`
          INSERT INTO Rol (Name, Description)
          VALUES (@Name, @Description)
        `);

        console.log("result created: ", result);
      return { success: true, message: "Rol creado exitosamente" };
    } catch (error) {
      console.error("Error al crear el rol:", error);
      return { success: false, message: "Error al crear el rol", error: error.message };
    }
  }

  // Actualizar un rol por ID
  static async updateRole(rolID, updatedData) {
    const { Name, Description } = updatedData;
    console.log("In model update Rol");
    console.log("Name: ", Name);
    console.log("rolID: ", rolID);

    try {
      const pool = await databaseInstance.getConnection();
      console.log("pool in model: ", pool);
      const result = await pool.request()
        .input("RolID", sql.Int, rolID)
        .input("Name", sql.VarChar(50), Name)
        .input("Description", sql.Text, Description)
        .query(`
          UPDATE Rol
          SET Name = @Name, Description = @Description
          WHERE RolID = @RolID
        `);
        console.log("result in model: ", result);

      if (result.rowsAffected[0] === 0) {
        return { success: false, message: "Rol no encontrado" };
      }
      return { success: true, message: "Rol actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      return { success: false, message: "Error al actualizar el rol", error: error.message };
    }
  }

  // Eliminar un rol por ID
  static async deleteRole(rolID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request()
        .input("RolID", sql.Int, rolID)
        .query("DELETE FROM Rol WHERE RolID = @RolID");

      if (result.rowsAffected[0] === 0) {
        return { success: false, message: "Rol no encontrado" };
      }
      return { success: true, message: "Rol eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      return { success: false, message: "Error al eliminar el rol", error: error.message };
    }
  }

  // Obtener un rol por nombre
  static async getRoleByName(name) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request()
        .input("Name", sql.VarChar(50), name)
        .query("SELECT * FROM Rol WHERE Name = @Name");

      if (result.recordset.length === 0) {
        return { success: false, message: "Rol no encontrado" };
      }
      return { success: true, role: result.recordset[0] };
    } catch (error) {
      console.error("Error al obtener el rol por nombre:", error);
      return { success: false, message: "Error al obtener el rol por nombre", error: error.message };
    }
  }
}

module.exports = RolModel;
