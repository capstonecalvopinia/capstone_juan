// controllers/StatisticsController.js
const Statistics = require("../models/statisticsModel");

const StatisticsController = {
  // Obtener todas las estadísticas
  async getAllStatistics(req, res) {
    try {
      const statistics = await Statistics.getAll();
      res.status(200).json({ status: true, data: statistics });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error fetching statistics",
        error: error.message,
      });
    }
  },
};

module.exports = StatisticsController;
