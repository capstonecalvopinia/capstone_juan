// models/productRecipeModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

class ProductRecipeModel {
  // Método para obtener todas las combinaciones de productos y recetas
  static async getAll() {
    const pool = await databaseInstance.getConnection();
    const query = `SELECT * FROM ProductRecipe`;
    const result = await pool.request().query(query);
    return result.recordset;
  }

  // Método para obtener una relación entre producto y receta por ID
  static async getByProductAndRecipe(productId, recipeId) {
    const pool = await databaseInstance.getConnection();
    const query = `SELECT * FROM ProductRecipe WHERE ProductID = @ProductID AND RecipeID = @RecipeID`;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .input("RecipeID", sql.Int, recipeId)
      .query(query);
    return result.recordset;
  }

  // Método para crear una nueva relación entre producto y receta
  static async create(productId, recipeId, quantity, unitId) {
    const pool = await databaseInstance.getConnection();
    const query = `
      INSERT INTO ProductRecipe (ProductID, RecipeID, Quantity, UnitID)
      VALUES (@ProductID, @RecipeID, @Quantity, @UnitID)
    `;
    await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .input("RecipeID", sql.Int, recipeId)
      .input("Quantity", sql.Decimal, quantity)
      .input("UnitID", sql.Int, unitId)
      .query(query);
    return { success: true, message: "Relación creada exitosamente" };
  }

  // Método para actualizar una relación existente
  static async update(productId, recipeId, quantity, unitId) {
    const pool = await databaseInstance.getConnection();
    const query = `
      UPDATE ProductRecipe
      SET Quantity = @Quantity, UnitID = @UnitID
      WHERE ProductID = @ProductID AND RecipeID = @RecipeID
    `;
    await pool
      .request()
      .input("Quantity", sql.Decimal, quantity)
      .input("UnitID", sql.Int, unitId)
      .input("ProductID", sql.Int, productId)
      .input("RecipeID", sql.Int, recipeId)
      .query(query);
    return { success: true, message: "Relación actualizada exitosamente" };
  }

  // Método para eliminar una relación entre producto y receta
  static async delete(productId, recipeId) {
    const pool = await databaseInstance.getConnection();
    const query = `DELETE FROM ProductRecipe WHERE ProductID = @ProductID AND RecipeID = @RecipeID`;
    await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .input("RecipeID", sql.Int, recipeId)
      .query(query);
    return { success: true, message: "Relación eliminada exitosamente" };
  }

  // Método para obtener todas las recetas para un producto
  static async getRecipesForProduct(productId) {
    const pool = await databaseInstance.getConnection();
    const query = `SELECT * FROM ProductRecipe WHERE ProductID = @ProductID`;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .query(query);
    return result.recordset;
  }

  static async getProductsForRecipe(recipeId) {
    const pool = await databaseInstance.getConnection();
    const query = `
        SELECT 
            pr.ProductID, 
            pr.Quantity, 
            pr.RecipeID, 
            pr.UnitID, 
            p.Name AS ProductName,
            p.Description AS ProductDescription,
            p.Price AS ProductPrice,
            p.Stock AS ProductStock,
            p.IsAvailable AS ProductIsAvailable,
            p.UnitID AS ProductUnitID,
            i.ImageUrl AS ProductImageUrl
        FROM 
            ProductRecipe pr
        JOIN 
            Product p ON pr.ProductID = p.ProductID
        LEFT JOIN 
            Image i ON p.ProductID = i.ProductID
        WHERE 
            pr.RecipeID = @RecipeID
    `;
    const result = await pool
      .request()
      .input("RecipeID", sql.Int, recipeId)
      .query(query);

    return result.recordset;
  }
}

module.exports = ProductRecipeModel;
