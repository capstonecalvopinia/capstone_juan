// models/likeModel.js
const db = require('../config/dbConfig');  // Aquí importa tu configuración de base de datos

const Like = {
  // Obtener todos los "likes" de un producto
  getLikesByProduct: async (productId) => {
    try {
      const result = await db.query(
        'SELECT * FROM [Like] WHERE ProductID = ?',
        [productId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Error fetching likes by product: ' + error.message);
    }
  },

  // Obtener todos los "likes" de un usuario
  getLikesByUser: async (userId) => {
    try {
      const result = await db.query(
        'SELECT * FROM [Like] WHERE UserID = ?',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Error fetching likes by user: ' + error.message);
    }
  },

  // Crear un "like" (asociación entre un producto y un usuario)
  addLike: async (productId, userId, date) => {
    try {
      const result = await db.query(
        'INSERT INTO [Like] (ProductID, UserID, Date) VALUES (?, ?, ?)',
        [productId, userId, date]
      );
      return result;
    } catch (error) {
      throw new Error('Error adding like: ' + error.message);
    }
  },

  // Eliminar un "like" (eliminar la relación entre el producto y el usuario)
  removeLike: async (productId, userId) => {
    try {
      const result = await db.query(
        'DELETE FROM [Like] WHERE ProductID = ? AND UserID = ?',
        [productId, userId]
      );
      return result;
    } catch (error) {
      throw new Error('Error removing like: ' + error.message);
    }
  }
};

module.exports = Like;
