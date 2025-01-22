// models/requestTypeModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

class RequestTypeModel {
  // Obtener todos los tipos de solicitud
  static async getAll() {
    try {
      const pool = await databaseInstance.getConnection();

      const result = await pool.request().query("SELECT * FROM RequestType");
      return result.recordset; // Cambiar rows a recordset según el cliente `mssql`
    } catch (error) {
      console.error("Error fetching request types: " + error.message);
      throw new Error("Error fetching request types: " + error.message);
    }
  }

  // Obtener un tipo de solicitud por ID
  static async getById(requestTypeId) {
    try {
      const pool = await databaseInstance.getConnection();

      const result = await pool
        .request()
        .input("RequestTypeID", sql.Int, requestTypeId)
        .query(
          "SELECT * FROM RequestType WHERE RequestTypeID = @RequestTypeID"
        );
      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching request type by ID: " + error.message);
      throw new Error("Error fetching request type by ID: " + error.message);
    }
  }

  // Crear un nuevo tipo de solicitud
  static async create(requestTypeData) {
    try {
      const pool = await databaseInstance.getConnection();

      const result = await pool
        .request()
        .input("Name", sql.VarChar(50), requestTypeData.Name)
        .input("Description", sql.Text, requestTypeData.Description).query(`
          INSERT INTO RequestType (Name, Description)
          VALUES (@Name, @Description)
        `);
        console.log("result create: ", result);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error creating request type: " + error.message);
      throw new Error("Error creating request type: " + error.message);
    }
  }

  // Actualizar un tipo de solicitud existente
  static async update(requestTypeId, updatedData) {
    try {
      const pool = await databaseInstance.getConnection();

      const result = await pool
        .request()
        .input("RequestTypeID", sql.Int, requestTypeId)
        .input("Name", sql.VarChar(50), updatedData.Name)
        .input("Description", sql.Text, updatedData.Description).query(`
          UPDATE RequestType
          SET Name = @Name, Description = @Description
          WHERE RequestTypeID = @RequestTypeID
        `);
      console.log("result in updating  request type model: ", result);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error updating request type: " + error.message);
      throw new Error("Error updating request type: " + error.message);
    }
  }

  // Eliminar un tipo de solicitud
  static async delete(requestTypeId) {
    try {
      console.log("delete request Type pre");
      const pool = await databaseInstance.getConnection();
      console.log("delete request Type");
      const response = await pool
        .request()
        .input("RequestTypeID", sql.Int, requestTypeId)
        .query("DELETE FROM RequestType WHERE RequestTypeID = @RequestTypeID");
      console.log("response: ", response);
      return { status: true, message: "Request type deleted successfully" };
    } catch (error) {
      console.error("Error deleting request type: " + error.message);
      throw new Error("Error deleting request type: " + error.message);
    }
  }
}

module.exports = RequestTypeModel;
