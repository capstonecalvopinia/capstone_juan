// models/categoryProductModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

// Modelo para la tabla CategoryProduct
class CategoryProductModel {
  // Obtener todos los productos de una categoría
  static async getProductsByCategory(categoryId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CategoryID", sql.Int, categoryID).query(`
          SELECT * FROM CategoryProduct WHERE CategoryID = @CategoryID
        `);

      // const result = await db.query(
      //   `
      //   SELECT * FROM CategoryProduct
      //   WHERE CategoryID = ?`,
      //   [categoryId]
      // );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las categorías de un producto
  static async getCategoriesByProduct(productId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().input("ProductID", sql.Int, productId)
        .query(`
          SELECT * FROM CategoryProduct WHERE ProductID = @ProductID
        `);

      // const result = await db.query(
      //   `
      //   SELECT * FROM CategoryProduct
      //   WHERE ProductID = ?`,
      //   [productId]
      // );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva relación entre Producto y Categoría
  static async createCategoryProduct(productId, categoryId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productId)
        .input("CategoryID", sql.Int, categoryId)
        .query(`
          INSERT INTO CategoryProduct (ProductID, CategoryID)
          VALUES (@ProductID, @CategoryID)
        `);

      // const result = await db.query(
      //   `
      //   INSERT INTO CategoryProduct (ProductID, CategoryID)
      //   VALUES (?, ?)`,
      //   [productId, categoryId]
      // );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una relación entre Producto y Categoría
  static async deleteCategoryProduct(productId, categoryId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("ProductID", sql.Int, productId)
        .input("CategoryID", sql.Int, categoryId).query(`
          DELETE FROM CategoryProduct WHERE ProductID = @ProductID AND CategoryID = @CategoryID
        `);

      // const result = await db.query(
      //   `
      //   DELETE FROM CategoryProduct 
      //   WHERE ProductID = ? AND CategoryID = ?`,
      //   [productId, categoryId]
      // );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = CategoryProductModel;
