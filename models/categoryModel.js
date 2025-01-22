// models/categoryModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

// Modelo para Category
const Category = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool.request().query("SELECT * FROM Category");

      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  // Obtener una categoría por su ID
  getCategoryById: async (categoryId) => {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CategoryId", sql.Int, categoryId)
        .query("SELECT * FROM Category WHERE CategoryID = @CategoryId");

      return result.recordset[0];
    } catch (error) {
      console.error(error);
    }
  },

  // Crear una nueva categoría
  createCategory: async (name, description) => {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CategoryId", sql.Int, categoryId)
        .input("Name", sql.VarChar(100), name)
        .input("Description", sql.Text, description)
        .query(
          "INSERT INTO Category (Name, Description) VALUES (@Name, @Description)"
        );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error(error);
    }
  },

  // Actualizar una categoría
  updateCategory: async (categoryId, name, description) => {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CategoryId", sql.Int, categoryId)
        .input("Name", sql.VarChar(100), name)
        .input("Description", sql.Text, description)
        .query(
          "UPDATE Category SET Name = @Name, Description = @Description WHERE CategoryID = @CategoryId"
        );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error(error);
    }
  },

  // Eliminar una categoría
  deleteCategory: async (categoryId) => {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("CategoryId", sql.Int, categoryId)
        .query("DELETE FROM Category WHERE CategoryID = @CategoryId");

      return result.rowsAffected > 0;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = Category;
