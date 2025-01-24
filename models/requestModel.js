const { databaseInstance, sql } = require("../config/dbConfig");

const { OrdersController } = require("@paypal/paypal-server-sdk");
const { client } = require("../config/paypal.js");
const {
  getFinancialUsers,
  getWineryUsers,
  getDeliveryUsers,
} = require("../models/userModel.js");
const { sendEmail } = require("../config/sendEmail");

class RequestModel {
  static async payWithPaypal(amount) {
    try {
      const ordersController = new OrdersController(client);
      const collect = {
        body: {
          intent: "CAPTURE",
          purchaseUnits: [
            {
              amount: {
                currencyCode: "USD",
                value: "" + amount,
              },
            },
          ],
        },
        prefer: "return=minimal",
      };

      const { body } = await ordersController.ordersCreate(collect);
      console.log("body in paypal payment: ", body);
      return body;
    } catch (error) {
      console.error("Error creando el pedido pago paypal:", error);
      throw new Error("Error creando el pedido pago paypal:" + error);
    }
  }

  // Capturar pedido
  static async capturePaypalPayment(orderID) {
    try {
      const ordersController = new OrdersController(client);
      const collect = {
        id: orderID,
        prefer: "return=minimal",
      };

      const { body } = await ordersController.ordersCapture(collect);
      return body;
    } catch (error) {
      console.error("Error capturando el pedido:", error);
      throw new Error("Error capturando el pedido:", error.message);
    }
  }

  // Obtener todos los pedidos
  static async getAll() {
    const pool = await databaseInstance.getConnection();
    const query = `
  SELECT 
      Request.*,
      
      [User].UserID AS User_UserID,
      [User].Name AS User_UserName,
      [User].Email AS User_Email,
      [User].BornDate AS User_BornDate,
      [User].PersonIdentification AS User_PersonIdentification,

      Priority.PriorityID AS Priority_PriorityID,
      Priority.Name AS Priority_Name,

      RequestType.RequestTypeID AS RequestType_RequestTypeID,
      RequestType.Name AS RequestType_Name,

      PaymentType.PaymentTypeID AS PaymentType_PaymentTypeID,
      PaymentType.Name AS PaymentType_Name,

      PaymentState.PaymentStateID AS PaymentState_PaymentStateID,
      PaymentState.Name AS PaymentState_Name,

      RequestRequestState.RequestStateID AS RequestState_RequestStateID,
      RequestState.Name AS RequestState_Name,
      RequestRequestState.UpdateDate AS RequestState_UpdateDate

  FROM 
      Request
  JOIN 
      [User] ON Request.UserID = [User].UserID
  JOIN 
      Priority ON Request.PriorityID = Priority.PriorityID
  JOIN 
      RequestType ON Request.RequestTypeID = RequestType.RequestTypeID
  JOIN 
      PaymentType ON Request.PaymentTypeID = PaymentType.PaymentTypeID
  JOIN 
      PaymentState ON Request.PaymentStateID = PaymentState.PaymentStateID
  LEFT JOIN 
      RequestRequestState ON Request.RequestID = RequestRequestState.RequestID
  LEFT JOIN 
      RequestState ON RequestRequestState.RequestStateID = RequestState.RequestStateID
  `;

    try {
      const result = await pool.request().query(query);

      // Transformar los datos para agrupar el historial de estados
      const requests = result.recordset.reduce((acc, row) => {
        let request = acc.find((r) => r.RequestID === row.RequestID);

        if (!request) {
          request = {
            ...row,
            RequestStates: [],
          };
          acc.push(request);
        }

        if (row.RequestState_RequestStateID) {
          request.RequestStates.push({
            RequestStateID: row.RequestState_RequestStateID,
            RequestStateName: row.RequestState_RequestStateName,
            UpdateDate: row.RequestState_UpdateDate,
          });
        }

        // Eliminar los campos de historial para evitar redundancia en el nivel superior
        delete request.RequestState_RequestStateID;
        delete request.RequestState_RequestStateName;
        delete request.RequestState_UpdateDate;

        return acc;
      }, []);

      return requests;
    } catch (error) {
      console.error("Error fetching requests:", error.message);
      throw new Error("Error fetching requests: " + error.message);
    }
  }

  static async getById(requestId) {
    console.log("requestId getById: ", requestId);
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        Request.*,
  
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
  
        RequestRequestState.RequestStateID AS RequestState_RequestStateID,
        RequestState.Name AS RequestState_Name,
        RequestRequestState.UpdateDate AS RequestState_UpdateDate,
  
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
        Request
      JOIN 
        [User] ON Request.UserID = [User].UserID
      JOIN 
        Priority ON Request.PriorityID = Priority.PriorityID
      JOIN 
        RequestType ON Request.RequestTypeID = RequestType.RequestTypeID
      LEFT JOIN 
        RequestRequestState ON Request.RequestID = RequestRequestState.RequestID
      LEFT JOIN 
        RequestState ON RequestRequestState.RequestStateID = RequestState.RequestStateID
      JOIN 
        PaymentType ON Request.PaymentTypeID = PaymentType.PaymentTypeID
      JOIN 
        PaymentState ON Request.PaymentStateID = PaymentState.PaymentStateID
      LEFT JOIN 
        RequestProduct ON Request.RequestID = RequestProduct.RequestID
      LEFT JOIN
        Product ON RequestProduct.ProductID = Product.ProductID
      LEFT JOIN
        Image ON Product.ProductID = Image.ProductID
      WHERE
        Request.RequestID = @RequestID
    `;

    try {
      const result = await pool
        .request()
        .input("RequestID", sql.Int, requestId)
        .query(query);

      console.log("result.recordset: ", result.recordset);
      // Procesar datos para agrupar productos, imágenes y estados
      const requestData = result.recordset.reduce((acc, row) => {
        if (!acc) {
          acc = {
            ...row,
            Products: [],
            RequestStates: [],
          };
        }

        // Procesar productos
        let product = acc.Products.find(
          (p) => p.ProductID === row.Product_ProductID
        );

        if (!product && row.Product_ProductID) {
          product = {
            ProductID: row.Product_ProductID,
            Name: row.Product_Name,
            Description: row.Product_Description,
            Price: row.Product_Price,
            Stock: row.Product_Stock,
            IsAvailable: row.Product_IsAvailable,
            UnitID: row.Product_UnitID,
            Quantity: row.Product_Quantity,
            Images: [],
          };
          acc.Products.push(product);
        }

        if (product && row.ImageID) {
          product.Images.push({
            ImageID: row.ImageID,
            ImageUrl: row.ImageUrl,
          });
        }

        // Procesar estados (sin filtrar duplicados)
        if (row.RequestState_RequestStateID) {
          acc.RequestStates.push({
            RequestStateID: row.RequestState_RequestStateID,
            Name: row.RequestState_Name,
            UpdateDate: row.RequestState_UpdateDate,
          });
        }

        return acc;
      }, null);

      return requestData;
    } catch (error) {
      console.error("Error fetching request by ID:", error.message);
      throw new Error("Error fetching request by ID: " + error.message);
    }
  }

  static async getByUserId(userId) {
    console.log("userId getByUserId: ", userId);
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        Request.*,
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
        RequestRequestState.RequestStateID AS RequestState_RequestStateID,
        RequestState.Name AS RequestState_Name,
        RequestRequestState.UpdateDate AS RequestState_UpdateDate,
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
        Request
      JOIN 
        [User] ON Request.UserID = [User].UserID
      JOIN 
        Priority ON Request.PriorityID = Priority.PriorityID
      JOIN 
        RequestType ON Request.RequestTypeID = RequestType.RequestTypeID
      LEFT JOIN 
        RequestRequestState ON Request.RequestID = RequestRequestState.RequestID
      LEFT JOIN 
        RequestState ON RequestRequestState.RequestStateID = RequestState.RequestStateID
      JOIN 
        PaymentType ON Request.PaymentTypeID = PaymentType.PaymentTypeID
      JOIN 
        PaymentState ON Request.PaymentStateID = PaymentState.PaymentStateID
      LEFT JOIN 
        RequestProduct ON Request.RequestID = RequestProduct.RequestID
      LEFT JOIN
        Product ON RequestProduct.ProductID = Product.ProductID
      LEFT JOIN
        Image ON Product.ProductID = Image.ProductID
      WHERE
        Request.UserID = @UserID
    `;

    try {
      const result = await pool
        .request()
        .input("UserID", sql.Int, userId)
        .query(query);

      const requests = result.recordset.reduce((acc, row) => {
        // Buscar si ya existe la solicitud actual en la lista
        let request = acc.find((req) => req.RequestID === row.RequestID);

        if (!request) {
          // Si la solicitud no existe, agregarla
          request = {
            ...row,
            Products: [],
            RequestStates: [], // Inicializar historial de estados
          };
          acc.push(request);
        }

        // Procesar productos
        let product = request.Products.find(
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
            Images: [], // Inicializar imágenes
          };
          request.Products.push(product);
        }

        // Agregar imágenes al producto
        if (product && row.ImageID) {
          product.Images.push({
            ImageID: row.ImageID,
            ImageUrl: row.ImageUrl,
          });
        }

        // Procesar estados (sin validar duplicados)
        if (row.RequestState_RequestStateID) {
          request.RequestStates.push({
            RequestStateID: row.RequestState_RequestStateID,
            Name: row.RequestState_Name,
            UpdateDate: row.RequestState_UpdateDate,
          });
        }

        return acc;
      }, []);

      return requests;
    } catch (error) {
      console.error("Error fetching requests by UserID:", error.message);
      throw new Error("Error fetching requests by UserID: " + error.message);
    }
  }

  // Crear un nuevo pedido
  static async create(requestData) {
    console.log("requestData create: ", requestData);
    const pool = await databaseInstance.getConnection();
    const query = `
      INSERT INTO Request (UserID, PriorityID, PriorityReason, RequestTypeID, PaymentTypeID, PaymentStateID, Address, RequestedDate, RequestedToDate, DeliveredDate)
      VALUES (@UserID, @PriorityID, @PriorityReason, @RequestTypeID, @PaymentTypeID, @PaymentStateID, @Address, @RequestedDate, @RequestedToDate, @DeliveredDate);
      SELECT SCOPE_IDENTITY() AS RequestID;
    `;
    try {
      const res = await pool
        .request()
        .input("UserID", sql.Int, requestData.UserID)
        .input("PriorityID", sql.Int, requestData.PriorityID)
        .input("PriorityReason", sql.Text, requestData.PriorityReason)
        .input("RequestTypeID", sql.Int, requestData.RequestTypeID)
        .input("PaymentTypeID", sql.Int, requestData.PaymentTypeID)
        .input("PaymentStateID", sql.Int, requestData.PaymentStateID)
        .input("Address", sql.VarChar, requestData.Address)
        .input("RequestedDate", sql.DateTime, requestData.RequestedDate)
        .input("RequestedToDate", sql.DateTime, requestData.RequestedToDate)
        .input("DeliveredDate", sql.DateTime, requestData.DeliveredDate)
        .query(query);

      // Extraer el RequestID del resultado
      console.log("res: ", res);
      const requestID = res.recordset[0].RequestID;
      return requestID;
    } catch (error) {
      console.error("Error creating request:", error.message);
      throw new Error("Error creating request: " + error.message);
    }
  }

  // Actualizar un pedido existente
  static async update(requestId, updatedData) {
    const pool = await databaseInstance.getConnection();
    const query = `
      UPDATE Request
      SET UserID = @UserID, PriorityID = @PriorityID, RequestTypeID = @RequestTypeID,
          PaymentTypeID = @PaymentTypeID, PaymentStateID = @PaymentStateID, Address = @Address, 
          RequestedDate = @RequestedDate, RequestedToDate = @RequestedToDate, DeliveredDate = @DeliveredDate
      WHERE RequestID = @RequestID
    `;
    try {
      await pool
        .request()
        .input("UserID", sql.Int, updatedData.UserID)
        .input("PriorityID", sql.Int, updatedData.PriorityID)
        .input("RequestTypeID", sql.Int, updatedData.RequestTypeID)
        .input("RequestStateID", sql.Int, updatedData.RequestStateID)
        .input("PaymentTypeID", sql.Int, updatedData.PaymentTypeID)
        .input("Address", sql.VarChar, updatedData.Address)
        .input("RequestedDate", sql.DateTime, updatedData.RequestedDate)
        .input("RequestedToDate", sql.DateTime, updatedData.RequestedToDate)
        .input("DeliveredDate", sql.DateTime, updatedData.DeliveredDate)
        .input("RequestID", sql.Int, requestId)
        .query(query);
    } catch (error) {
      console.error("Error updating request:", error.message);
      throw new Error("Error updating request: " + error.message);
    }
  }

  static async updateRequestType(requestId, RequestTypeID) {
    const pool = await databaseInstance.getConnection();
    const query = `
      UPDATE Request
      SET RequestTypeID = @RequestTypeID
      WHERE RequestID = @RequestID
    `;
    try {
      await pool
        .request()
        .input("RequestTypeID", sql.Int, RequestTypeID)
        .input("RequestID", sql.Int, requestId)
        .query(query);
    } catch (error) {
      console.error("Error updating RequestTypeID request:", error.message);
      throw new Error("Error updating RequestTypeID request: " + error.message);
    }
  }

  static async updatePaymentState(requestId, PaymentStateID) {
    const pool = await databaseInstance.getConnection();
    const query = `
      UPDATE Request
      SET PaymentStateID = @PaymentStateID
      WHERE RequestID = @RequestID
    `;
    try {
      const res = await pool
        .request()
        .input("PaymentStateID", sql.Int, PaymentStateID)
        .input("RequestID", sql.Int, requestId)
        .query(query);

      console.log("res updatePaymentState: ", res);
      return res.recordset;
    } catch (error) {
      console.error("Error updating PaymentStateID request:", error.message);
      throw new Error(
        "Error updating PaymentStateID request: " + error.message
      );
    }
  }

  static async createRequestState(data) {
    const pool = await databaseInstance.getConnection();
    const result = await pool
      .request()
      .input("RequestStateID", sql.Int, data.RequestStateID)
      .input("RequestID", sql.Int, data.RequestID)
      .query(`INSERT INTO RequestRequestState (RequestStateID, RequestID)
              VALUES (@RequestStateID, @RequestID);
              SELECT SCOPE_IDENTITY() AS RequestRequestStateID`);
    //Condición para verificar si el RequestStateID es 3 (Validada)
    if (data.RequestStateID == 1) {
      console.log("data.RequestStateID = 1");
      const financialUsers = await getFinancialUsers();
      console.log("financialUsers: ", financialUsers);
      const usersTo = financialUsers.map((user) => user.Email).join(";");
      console.log("usersTo:", usersTo);

      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Financiero, la orden con id ${data.RequestID} ha sido ingresada, por favor valida el pago correspondiente para continuar con el proceso.</p>
      </div>`;

      console.log("htmlMessage: ", html);

      const resSendEmail = await sendEmail(
        usersTo,
        "Frish Alimentos Congelados | Orden Ingresada",
        " ",
        html
      );

      console.log("resSendEmail: ", resSendEmail);
    } else if (data.RequestStateID == 2) {
      console.log("data.RequestStateID = 2");
      const financialUsers = await getFinancialUsers();
      console.log("financialUsers: ", financialUsers);
      const usersTo = financialUsers.map((user) => user.Email).join(";");
      console.log("usersTo:", usersTo);

      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Financiero, la orden con id ${data.RequestID} ha sido ingresada, por favor valida el pago correspondiente para continuar con el proceso.</p>
      </div>`;

      console.log("htmlMessage: ", html);

      const resSendEmail = await sendEmail(
        usersTo,
        "Frish Alimentos Congelados | Validando Orden",
        " ",
        html
      );

      console.log("resSendEmail: ", resSendEmail);
    } else if (data.RequestStateID == 3) {
      console.log("data.RequestStateID = 3");
      const wineryUsers = await getWineryUsers();
      console.log("wineryUsers: ", wineryUsers);
      const usersTo = wineryUsers.map((user) => user.Email).join(";");
      console.log("usersTo:", usersTo);

      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Bodeguero, el pago de la orden con id ${data.RequestID} ha sido validada, por favor continuar con el proceso.</p>
      </div>`;

      console.log("htmlMessage: ", html);

      const resSendEmail = await sendEmail(
        usersTo,
        "Frish Alimentos Congelados | Orden Validada",
        " ",
        html
      );

      console.log("resSendEmail: ", resSendEmail);
    } else if (data.RequestStateID == 5) {
      console.log("data.RequestStateID = 5");
      const wineryUsers = await getWineryUsers();
      console.log("wineryUsers: ", wineryUsers);
      const usersTo = wineryUsers.map((user) => user.Email).join(";");
      console.log("usersTo:", usersTo);

      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Bodeguero, la orden con id ${data.RequestID} ha sido puesta en 'Preparando Orden', por favor continuar con el proceso.</p>
      </div>`;

      console.log("htmlMessage: ", html);

      const resSendEmail = await sendEmail(
        usersTo,
        "Frish Alimentos Congelados | Preparando Orden",
        " ",
        html
      );

      console.log("resSendEmail: ", resSendEmail);
    } else if (data.RequestStateID == 6) {
      console.log("data.RequestStateID = 6");
      const deliveryUsers = await getDeliveryUsers();
      console.log("deliveryUsers: ", deliveryUsers);
      const usersTo = deliveryUsers.map((user) => user.Email).join(";");
      console.log("usersTo:", usersTo);

      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Repartidor, la orden con id ${data.RequestID} ha sido puesta en 'Reparto', por favor continuar con el proceso.</p>
      </div>`;

      console.log("htmlMessage: ", html);

      const resSendEmail = await sendEmail(
        usersTo,
        "Frish Alimentos Congelados | Orden En Reparto",
        " ",
        html
      );

      console.log("resSendEmail: ", resSendEmail);
    }
    return result.recordset[0];
  }

  static async requestPaymentVerify(data) {
    // data = {data.RequestID, data.RequestStateID}
    console.log("data.RequestStateID = 1");
    const financialUsers = await getFinancialUsers();
    console.log("financialUsers: ", financialUsers);
    const usersTo = financialUsers.map((user) => user.Email).join(";");
    console.log("usersTo:", usersTo);

    // Generar HTML dinámico
    let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu ayuda!</h2>
      <p>Estimado usuario Financiero, el usuario ha solicitado la verificación del pago de la orden con id ${data.RequestID}, por favor valida el pago correspondiente a la brevedad posible para continuar con el proceso.</p>
      </div>`;

    console.log("htmlMessage: ", html);

    const resSendEmail = await sendEmail(
      usersTo,
      "Frish Alimentos Congelados | Verificación de Pago Solicitada",
      " ",
      html
    );

    console.log("resSendEmail: ", resSendEmail);
    return resSendEmail;
  }

  // Eliminar un pedido
  static async delete(requestId) {
    const pool = await databaseInstance.getConnection();
    const query = "DELETE FROM Request WHERE RequestID = @RequestID";
    try {
      await pool.request().input("RequestID", sql.Int, requestId).query(query);
    } catch (error) {
      console.error("Error deleting request:", error.message);
      throw new Error("Error deleting request: " + error.message);
    }
  }
}

module.exports = RequestModel;
