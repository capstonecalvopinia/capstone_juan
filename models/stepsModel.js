const { databaseInstance, sql } = require("../config/dbConfig.js");

class StepModel {
  // Obtener todos los pasos
  static async getAllSteps() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM Steps");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener los pasos:", error);
      throw new Error("Error al obtener los pasos");
    }
  }

  // Obtener un paso por ID
  static async getStepById(stepID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("StepID", sql.Int, stepID)
        .query("SELECT * FROM Steps WHERE StepID = @StepID");
      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error al obtener el paso:", error);
      throw new Error("Error al obtener el paso");
    }
  }

  // Crear un nuevo paso
  static async createStep(stepData) {
    const { Name, Description, Time, NumberOfStep, RecipeID } = stepData;
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Name", sql.VarChar, Name)
        .input("Description", sql.Text, Description)
        .input("Time", sql.Int, Time)
        .input("NumberOfStep", sql.Int, NumberOfStep)
        .input("RecipeID", sql.Int, RecipeID)
        .query(
          "INSERT INTO Steps (Name, Description, Time, NumberOfStep, RecipeID) OUTPUT INSERTED.* VALUES (@Name, @Description, @Time, @NumberOfStep, @RecipeID)"
        );

      return result.recordset[0];
    } catch (error) {
      console.error("Error al crear el paso:", error);
      throw new Error("Error al crear el paso");
    }
  }

  // Actualizar un paso
  static async updateStep(stepID, updatedData) {
    const { Name, Description, Time, NumberOfStep, RecipeID } = updatedData;
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("StepID", sql.Int, stepID)
        .input("Name", sql.VarChar, Name)
        .input("Description", sql.Text, Description)
        .input("Time", sql.Int, Time)
        .input("NumberOfStep", sql.Int, NumberOfStep)
        .input("RecipeID", sql.Int, RecipeID)
        .query(
          "UPDATE Steps SET Name = @Name, Description = @Description, Time = @Time, NumberOfStep = @NumberOfStep, RecipeID = @RecipeID WHERE StepID = @StepID"
        );

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar el paso:", error);
      throw new Error("Error al actualizar el paso");
    }
  }

  // Eliminar un paso
  static async deleteStep(stepID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("StepID", sql.Int, stepID)
        .query("DELETE FROM Steps WHERE StepID = @StepID");

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar el paso:", error);
      throw new Error("Error al eliminar el paso");
    }
  }

  // Obtener los pasos por RecipeID
  static async getStepsByRecipeId(recipeID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("RecipeID", sql.Int, recipeID)
        .query(
          "SELECT * FROM Steps WHERE RecipeID = @RecipeID ORDER BY NumberOfStep"
        );

      return result.recordset;
    } catch (error) {
      console.error("Error al obtener los pasos por RecipeID:", error);
      throw new Error("Error al obtener los pasos por RecipeID");
    }
  }
}

module.exports = StepModel;
