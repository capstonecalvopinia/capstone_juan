const { databaseInstance, sql } = require("../config/dbConfig");

class CartModel {
  // Obtener todos los pedidos
  static async getAll() {
    const pool = await databaseInstance.getConnection();
    const query = `
  SELECT 
    Cart.*,
    
    [User].UserID AS User_UserID,
    [User].Name AS User_UserName,
    [User].Email AS User_Email,
    [User].BornDate AS User_BornDate,
    [User].PersonIdentification AS User_PersonIdentification,

    Priority.PriorityID AS Priority_PriorityID,
    Priority.Name AS Priority_Name,

    RequestType.RequestTypeID AS RequestType_RequestTypeID,
    RequestType.Name AS RequestType_Name,

    RequestState.RequestStateID AS RequestState_RequestStateID,
    RequestState.Name AS RequestState_Name,

    PaymentType.PaymentTypeID AS PaymentType_PaymentTypeID,
    PaymentType.Name AS PaymentType_Name,

    PaymentState.PaymentStateID AS PaymentState_PaymentStateID,
    PaymentState.Name AS PaymentState_Name
  FROM 
    Cart
  JOIN 
    [User] ON Cart.UserID = [User].UserID
  JOIN 
    Priority ON Cart.PriorityID = Priority.PriorityID
  JOIN 
    RequestType ON Cart.RequestTypeID = RequestType.RequestTypeID
  JOIN 
    RequestState ON Cart.RequestStateID = RequestState.RequestStateID
  JOIN 
    PaymentType ON Cart.PaymentTypeID = PaymentType.PaymentTypeID
  JOIN 
    PaymentState ON Cart.PaymentStateID = PaymentState.PaymentStateID
`;

    try {
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching Carts:", error.message);
      throw new Error("Error fetching Carts: " + error.message);
    }
  }

  static async getById(CartId) {
    console.log("CartId getById: ", CartId);
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        Cart.*,
  
        [User].UserID AS User_UserID,
        [User].Name AS User_UserName,
        [User].Email AS User_Email,
        [User].BornDate AS User_BornDate,
        [User].PersonIdentification AS User_PersonIdentification,
        [User].Cellphone AS User_Cellphone,
  
        Priority.PriorityID AS Priority_PriorityID,
        Priority.Name AS Priority_Name,
  
        RequestType.RequestTypeID AS RequestType_RequestTypeID,
        RequestType.Name AS RequestType_Name,
  
        RequestState.RequestStateID AS RequestState_RequestStateID,
        RequestState.Name AS RequestState_Name,
  
        PaymentType.PaymentTypeID AS PaymentType_PaymentTypeID,
        PaymentType.Name AS PaymentType_Name,
  
        PaymentState.PaymentStateID AS PaymentState_PaymentStateID,
        PaymentState.Name AS PaymentState_Name,

        RequestProduct.Quantity AS Product_Quantity,
        Product.ProductID AS Product_ProductID,
        Product.Name AS Product_Name,
        Product.Description AS Product_Description,
        Product.Price AS Product_Price,
        Product.Stock AS Product_Stock,
        Product.IsAvailable AS Product_IsAvailable,
        Product.UnitID AS Product_UnitID,
        Image.ImageID AS ImageID,
        Image.ImageUrl AS ImageUrl
      FROM 
        Cart
      JOIN 
        [User] ON Cart.UserID = [User].UserID
      JOIN 
        Priority ON Cart.PriorityID = Priority.PriorityID
      JOIN 
        RequestType ON Cart.RequestTypeID = RequestType.RequestTypeID
      JOIN 
        RequestState ON Cart.RequestStateID = RequestState.RequestStateID
      JOIN 
        PaymentType ON Cart.PaymentTypeID = PaymentType.PaymentTypeID
      JOIN 
        PaymentState ON Cart.PaymentStateID = PaymentState.PaymentStateID
      LEFT JOIN 
        RequestProduct ON Cart.RequestID = RequestProduct.RequestID
      LEFT JOIN
        Product ON RequestProduct.ProductID = Product.ProductID
      LEFT JOIN
        Image ON Product.ProductID = Image.ProductID
      WHERE
        Cart.CartID = @CartID
    `;

    try {
      const result = await pool
        .request()
        .input("CartID", sql.Int, CartId)
        .query(query);

      // Procesar datos para agrupar productos e imágenes
      const CartData = result.recordset.reduce((acc, row) => {
        if (!acc) {
          acc = {
            ...row,
            Products: [],
          };
        }

        // Buscar el producto en la lista de productos
        let product = acc.Products.find(
          (p) => p.ProductID === row.Product_ProductID
        );

        if (!product && row.Product_ProductID) {
          // Si el producto no existe, agregarlo
          product = {
            ProductID: row.Product_ProductID,
            Name: row.Product_Name,
            Description: row.Product_Description,
            Price: row.Product_Price,
            Stock: row.Product_Stock,
            IsAvailable: row.Product_IsAvailable,
            UnitID: row.Product_UnitID,
            Quantity: row.Product_Quantity,
            Images: [], // Inicializar el arreglo de imágenes
          };
          acc.Products.push(product);
        }

        // Agregar la imagen al producto
        if (product && row.ImageID) {
          product.Images.push({
            ImageID: row.ImageID,
            ImageUrl: row.ImageUrl,
          });
        }

        return acc;
      }, null);

      return CartData;
    } catch (error) {
      console.error("Error fetching Cart by ID:", error.message);
      throw new Error("Error fetching Cart by ID: " + error.message);
    }
  }

  static async getByUserId(UserId) {
    console.log("UserId getByUserId: ", UserId);
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        Cart.*,
  
        [User].UserID AS User_UserID,
        [User].Name AS User_UserName,
        [User].Email AS User_Email,
        [User].BornDate AS User_BornDate,
        [User].PersonIdentification AS User_PersonIdentification,
        [User].Cellphone AS User_Cellphone,
  
        Priority.PriorityID AS Priority_PriorityID,
        Priority.Name AS Priority_Name,
  
        RequestType.RequestTypeID AS RequestType_RequestTypeID,
        RequestType.Name AS RequestType_Name,
  
        RequestState.RequestStateID AS RequestState_RequestStateID,
        RequestState.Name AS RequestState_Name,
  
        PaymentType.PaymentTypeID AS PaymentType_PaymentTypeID,
        PaymentType.Name AS PaymentType_Name,
  
        PaymentState.PaymentStateID AS PaymentState_PaymentStateID,
        PaymentState.Name AS PaymentState_Name,
  
        CartProduct.Quantity AS Cart_Quantity,
        Product.ProductID AS Product_ProductID,
        Product.Name AS Product_Name,
        Product.Description AS Product_Description,
        Product.Price AS Product_Price,
        Product.Stock AS Product_Stock,
        Product.IsAvailable AS Product_IsAvailable,
        Product.UnitID AS Product_UnitID,
        Image.ImageID AS ImageID,
        Image.ImageUrl AS ImageUrl
      FROM 
        Cart
      JOIN 
        [User] ON Cart.UserID = [User].UserID
      JOIN 
        Priority ON Cart.PriorityID = Priority.PriorityID
      JOIN 
        RequestType ON Cart.RequestTypeID = RequestType.RequestTypeID
      JOIN 
        RequestState ON Cart.RequestStateID = RequestState.RequestStateID
      JOIN 
        PaymentType ON Cart.PaymentTypeID = PaymentType.PaymentTypeID
      JOIN 
        PaymentState ON Cart.PaymentStateID = PaymentState.PaymentStateID
      LEFT JOIN 
        CartProduct ON Cart.CartID = CartProduct.CartID
      LEFT JOIN
        Product ON CartProduct.ProductID = Product.ProductID
      LEFT JOIN
        Image ON Product.ProductID = Image.ProductID
      WHERE
        Cart.UserID = @UserID
    `;

    try {
      const result = await pool
        .request()
        .input("UserID", sql.Int, UserId)
        .query(query);

      console.log("getByUserId result: ", result);
      // Procesar datos para agrupar productos e imágenes
      const CartData = result.recordset.reduce((acc, row) => {
        if (!acc) {
          acc = {
            ...row,
            Products: [],
          };
        }

        // Buscar el producto en la lista de productos
        let product = acc.Products.find(
          (p) => p.ProductID === row.Product_ProductID
        );

        if (!product && row.Product_ProductID) {
          console.log("row row: ", row);
          product = {
            productID: row.Product_ProductID,
            name: row.Product_Name,
            description: row.Product_Description,
            price: row.Product_Price,
            quantity: row.Cart_Quantity,
            stock: row.Product_Stock,
            isAvailable: row.Product_IsAvailable,
            unitID: row.Product_UnitID,
            images: [], // Inicializar el arreglo de imágenes
          };
          console.log("product quantity: ", product);
          acc.Products.push(product);
        }

        // Agregar la imagen al producto
        if (product && row.ImageID) {
          product.images.push({
            imageID: row.ImageID,
            imageUrl: row.ImageUrl,
          });
        }
        //console.log("return acc: ", acc);
        return acc;
      }, null);

      //console.log("getByUserId CartData: ", CartData);
      return CartData;
    } catch (error) {
      console.error("Error fetching Cart by User ID:", error.message);
      throw new Error("Error fetching Cart by User ID: " + error.message);
    }
  }


  // Crear un nuevo pedido
  static async create(CartData) {
    console.log("CartData create: ", CartData);
    const pool = await databaseInstance.getConnection();
    const query = `
      INSERT INTO Cart (UserID, PriorityID, PriorityReason, RequestTypeID, RequestStateID, PaymentTypeID, PaymentStateID, Address, RequestedDate, RequestedToDate, DeliveredDate)
      VALUES (@UserID, @PriorityID, @PriorityReason, @RequestTypeID, @RequestStateID, @PaymentTypeID, @PaymentStateID, @Address, @RequestedDate, @RequestedToDate, @DeliveredDate);
      SELECT SCOPE_IDENTITY() AS CartID;
    `;
    try {
      if(CartData.RequestedToDate == ""){
        CartData.RequestedToDate = null;
      }

      if(CartData.PriorityID == ""){
        CartData.PriorityID = 2;
      }

      if(CartData.RequestTypeID == ""){
        CartData.RequestTypeID = 1;
      }

      if(CartData.PaymentTypeID == ""){
        CartData.PaymentTypeID = 2;
      }


      const res = await pool
        .request()
        .input("UserID", sql.Int, CartData.UserID)
        .input("PriorityID", sql.Int, CartData.PriorityID)
        .input("PriorityReason", sql.Text, CartData.PriorityReason)
        .input("RequestTypeID", sql.Int, CartData.RequestTypeID)
        .input("RequestStateID", sql.Int, CartData.RequestStateID)
        .input("PaymentTypeID", sql.Int, CartData.PaymentTypeID)
        .input("PaymentStateID", sql.Int, CartData.PaymentStateID)
        .input("Address", sql.VarChar, CartData.Address)
        .input("RequestedDate", sql.DateTime, CartData.RequestedDate)
        .input("RequestedToDate", sql.DateTime, CartData.RequestedToDate)
        .input("DeliveredDate", sql.DateTime, CartData.DeliveredDate)
        .query(query);

      // Extraer el CartID del resultado
      console.log("res: ", res);
      const CartID = res.recordset[0].CartID;
      return CartID;
    } catch (error) {
      console.error("Error creating Cart:", error.message);
      throw new Error("Error creating Cart: " + error.message);
    }
  }

  // Actualizar un pedido existente
  static async update(CartId, updatedData) {
    const pool = await databaseInstance.getConnection();
    const query = `
      UPDATE Cart
      SET UserID = @UserID, PriorityID = @PriorityID, RequestTypeID = @RequestTypeID, RequestStateID = @RequestStateID, 
          PaymentTypeID = @PaymentTypeID, PaymentStateID = @PaymentStateID, Address = @Address, 
          RequestedDate = @RequestedDate, RequestedToDate = @RequestedToDate, DeliveredDate = @DeliveredDate
      WHERE CartID = @CartID
    `;
    try {
      const res = await pool
        .request()
        .input("UserID", sql.Int, updatedData.UserID)
        .input("PriorityID", sql.Int, updatedData.PriorityID)
        .input("RequestTypeID", sql.Int, updatedData.RequestTypeID)
        .input("RequestStateID", sql.Int, updatedData.RequestStateID)
        .input("PaymentTypeID", sql.Int, updatedData.PaymentTypeID)
        .input("PaymentStateID", sql.Int, updatedData.PaymentStateID)
        .input("Address", sql.VarChar, updatedData.Address)
        .input("RequestedDate", sql.DateTime, updatedData.RequestedDate)
        .input("RequestedToDate", sql.DateTime, updatedData.RequestedToDate)
        .input("DeliveredDate", sql.DateTime, updatedData.DeliveredDate)
        .input("CartID", sql.Int, CartId)
        .query(query);
        return res;
    } catch (error) {
      console.error("Error updating Cart:", error.message);
      throw new Error("Error updating Cart: " + error.message);
    }
  }

  // Eliminar un pedido
  static async delete(CartId) {
    const pool = await databaseInstance.getConnection();
    const query = "DELETE FROM Cart WHERE CartID = @CartID";
    try {
      await pool.request().input("CartID", sql.Int, CartId).query(query);
    } catch (error) {
      console.error("Error deleting Cart:", error.message);
      throw new Error("Error deleting Cart: " + error.message);
    }
  }
}

module.exports = CartModel;
