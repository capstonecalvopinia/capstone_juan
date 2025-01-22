// controllers/likeController.js
const Like = require('../models/likeModel');

const likeController = {
  // Obtener todos los "likes" de un producto
  async getLikesByProduct(req, res) {
    const { productId } = req.params;
    try {
      const likes = await Like.getLikesByProduct(productId);
      res.status(200).json({
        status: true,
        msg: 'Likes retrieved successfully',
        data: likes
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: 'Error fetching likes by product',
        error: error.message
      });
    }
  },

  // Obtener todos los "likes" de un usuario
  async getLikesByUser(req, res) {
    const { userId } = req.params;
    try {
      const likes = await Like.getLikesByUser(userId);
      res.status(200).json({
        status: true,
        msg: 'Likes retrieved successfully',
        data: likes
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: 'Error fetching likes by user',
        error: error.message
      });
    }
  },

  // Crear un "like" para un producto por un usuario
  async addLike(req, res) {
    const { productId, userId, date } = req.body;
    try {
      await Like.addLike(productId, userId, date);
      res.status(201).json({
        status: true,
        msg: 'Like added successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: 'Error adding like',
        error: error.message
      });
    }
  },

  // Eliminar un "like" (producto y usuario)
  async removeLike(req, res) {
    const { productId, userId } = req.params;
    try {
      await Like.removeLike(productId, userId);
      res.status(200).json({
        status: true,
        msg: 'Like removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: 'Error removing like',
        error: error.message
      });
    }
  }
};

module.exports = likeController;
