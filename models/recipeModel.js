// models/recipeModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

class RecipeModel {
  // Método para obtener todas las recetas
  static async getAllRecipes() {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM Recipe");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
      return {
        success: false,
        message: "Error al obtener las recetas",
        error: error.message,
      };
    }
  }

  // Método para obtener una receta por su ID
  static async getRecipeById(recipeID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("RecipeID", sql.Int, recipeID)
        .query("SELECT * FROM Recipe WHERE RecipeID = @RecipeID");

      const recipe = result.recordset[0];

      if (!recipe) {
        return { success: false, message: "Receta no encontrada" };
      }

      return { success: true, recipe: recipe };
    } catch (error) {
      console.error("Error al obtener la receta:", error);
      return {
        success: false,
        message: "Error al obtener la receta",
        error: error.message,
      };
    }
  }

  // Método para obtener recetas por un arreglo de IDs
  static async getRecipesByIds(recipeIDs) {
    try {
      const pool = await databaseInstance.getConnection();
      
      // Convertir el arreglo de IDs en una cadena separada por comas para usarlos en la consulta SQL
      const ids = recipeIDs.join(',');

      const result = await pool
        .request()
        .input("RecipeIDs", sql.NVarChar, ids)
        .query(`SELECT * FROM Recipe WHERE RecipeID IN (${ids})`);

      const recipes = result.recordset;

      if (recipes.length === 0) {
        return { success: false, message: "No se encontraron recetas para los IDs proporcionados" };
      }

      return { success: true, recipes: recipes };
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
      return {
        success: false,
        message: "Error al obtener las recetas",
        error: error.message,
      };
    }
  }


  // Método para crear una nueva receta
  static async createRecipe(name, description, preparationTime, cookingTime, quantity, portions, calories) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Name", sql.VarChar, name)
        .input("Description", sql.Text, description)
        .input("PreparationTime", sql.Int, preparationTime)
        .input("CookingTime", sql.Int, cookingTime)
        .input("Quantity", sql.Int, quantity)
        .input("Portions", sql.Int, portions)
        .input("Calories", sql.Int, calories)
        .query(`
          INSERT INTO Recipe (Name, Description, PreparationTime, CookingTime, Quantity, Portions, Calories)
          OUTPUT INSERTED.*
          VALUES (@Name, @Description, @PreparationTime, @CookingTime, @Quantity, @Portions, @Calories)
        `);

      return {
        success: true,
        message: "Receta creada exitosamente",
        recipe: result.recordset[0],
      };
    } catch (error) {
      console.error("Error al crear la receta:", error);
      return {
        success: false,
        message: "Error al crear la receta",
        error: error.message,
      };
    }
  }

  // Método para actualizar una receta existente
  static async updateRecipe(recipeID, name, description, preparationTime, cookingTime, quantity, portions, calories) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("RecipeID", sql.Int, recipeID)
        .input("Name", sql.VarChar, name)
        .input("Description", sql.Text, description)
        .input("PreparationTime", sql.Int, preparationTime)
        .input("CookingTime", sql.Int, cookingTime)
        .input("Quantity", sql.Int, quantity)
        .input("Portions", sql.Int, portions)
        .input("Calories", sql.Int, calories)
        .query(`
          UPDATE Recipe
          SET 
            Name = @Name,
            Description = @Description,
            PreparationTime = @PreparationTime,
            CookingTime = @CookingTime,
            Quantity = @Quantity,
            Portions = @Portions,
            Calories = @Calories
          WHERE RecipeID = @RecipeID
        `);

      return { success: true, message: "Receta actualizada exitosamente" };
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
      return {
        success: false,
        message: "Error al actualizar la receta",
        error: error.message,
      };
    }
  }

  // Método para eliminar una receta
  static async deleteRecipe(recipeID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("RecipeID", sql.Int, recipeID)
        .query("DELETE FROM Recipe WHERE RecipeID = @RecipeID");

      return { success: true, message: "Receta eliminada exitosamente" };
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
      return {
        success: false,
        message: "Error al eliminar la receta",
        error: error.message,
      };
    }
  }
}

module.exports = RecipeModel;
