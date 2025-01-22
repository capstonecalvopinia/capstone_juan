const { databaseInstance, sql } = require("../config/dbConfig");

class StatisticsModel {
  // Obtener todas las estadísticas
  static async getAll() {
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        -- Pedidos del Mes
        (SELECT COUNT(*) 
         FROM Request 
         WHERE MONTH(RequestedDate) = MONTH(GETDATE()) 
           AND YEAR(RequestedDate) = YEAR(GETDATE())) AS OrdersThisMonth,

        -- Usuarios Registrados
        (SELECT COUNT(*) FROM [User]) AS RegisteredUsers,

        -- Productos en Stock
        (SELECT SUM(Stock) FROM Product WHERE Stock > 0) AS ProductsInStock,

        -- Roles Activos
        (SELECT COUNT(*) FROM Rol) AS ActiveRoles,

        -- Total de Ventas del Mes
        (SELECT SUM(RequestProduct.Quantity * Product.Price) 
         FROM RequestProduct 
         JOIN Product ON RequestProduct.ProductID = Product.ProductID
         JOIN Request ON RequestProduct.RequestID = Request.RequestID
         WHERE MONTH(Request.RequestedDate) = MONTH(GETDATE()) 
           AND YEAR(Request.RequestedDate) = YEAR(GETDATE())) AS MonthlySales,

        -- Productos Más Vendidos
        (SELECT TOP 1 Product.Name
         FROM RequestProduct 
         JOIN Product ON RequestProduct.ProductID = Product.ProductID
         GROUP BY Product.Name
         ORDER BY SUM(RequestProduct.Quantity) DESC) AS BestSellingProduct,

        -- Usuarios con Más Pedidos
        (SELECT TOP 1 [User].Name
         FROM Request
         JOIN [User] ON Request.UserID = [User].UserID
         GROUP BY [User].Name
         ORDER BY COUNT(Request.RequestID) DESC) AS MostActiveUser

        
    `;
    // -- Pedidos Pendientes
    // (SELECT COUNT(*) FROM Request WHERE RequestStateID = 1) AS PendingOrders
    try {
      const result = await pool.request().query(query);
      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching statistics:", error.message);
      throw new Error("Error fetching statistics: " + error.message);
    }
  }
}

module.exports = StatisticsModel;
