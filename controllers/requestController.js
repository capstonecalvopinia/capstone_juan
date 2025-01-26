// controllers/requestController.js
const Request = require("../models/requestModel");
const RequestProduct = require("../models/requestProductModel");
const { sendEmail } = require("../config/sendEmail");
const requestController = {
  // Obtener todos los pedidos
  async getAllRequests(req, res) {
    try {
      const requests = await Request.getAll();
      res.status(200).json({ status: true, data: requests });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error fetching requests",
        error: error.message,
      });
    }
  },

  // Obtener un pedido por ID
  async getRequestById(req, res) {
    //console.log("getRequestById req.params: ", req);
    const { requestId } = req.params;
    try {
      const request = await Request.getById(requestId);
      if (!request) {
        return res
          .status(404)
          .json({ status: false, msg: "Request not found" });
      }
      res.status(200).json({ status: true, data: request });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error fetching request by ID",
        error: error.message,
      });
    }
  },

  async getRequestsByUserId(req, res) {
    //console.log("getRequestsByUserId req.params: ", req.params);
    const { userId } = req.params;

    try {
      // Llamar a la función del modelo para obtener las solicitudes
      const requests = await Request.getByUserId(userId);

      // Verificar si no se encontraron solicitudes
      if (!requests || requests.length === 0) {
        return res.status(200).json({
          status: false,
          msg: "No requests found for the specified user",
        });
      }

      // Responder con éxito y los datos encontrados
      res.status(200).json({ status: true, data: requests });
    } catch (error) {
      console.error("Error fetching requests by UserID:", error.message);
      res.status(500).json({
        status: false,
        msg: "Error fetching requests by UserID",
        error: error.message,
      });
    }
  },

  // Crear un nuevo pedido
  async payWithPaypal(req, res) {
    try {
      console.log("payWithPaypal req.body: ", req.body);
      const { cart } = req.body;

      //Calculo de los valores
      console.log("Products payWithPaypal: ", cart.Products);
      let totalQuantity = 0;
      let totalAmount = 0;

      cart.Products.forEach((product) => {
        totalQuantity += product.quantity;
        totalAmount += product.price * product.quantity;
      });

      console.log("totalQuantity: ", totalQuantity);
      console.log("totalAmount: ", totalAmount);

      //se realiza el pago según lo elegido en tipo de pago
      //En la bdd el tipo de pago con tarjeta es 2

      const requestPaymentState = await Request.payWithPaypal(totalAmount);
      console.log("requestPaymentState: ", requestPaymentState);

      res.status(201).json(JSON.parse(requestPaymentState));
    } catch (error) {
      res.status(500).json({ error: "Error al crear el pedido." });
    }
  },

  async capturePaypalPayment(req, res) {
    console.log("createRequest req.body: ", req.body);

    const { orderID } = req.params;

    try {
      const capturePayment = await Request.capturePaypalPayment(orderID);
      console.log("capturePayment: ", capturePayment);

      res.status(200).json(JSON.parse(capturePayment));
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error capture payment",
        error: error.message,
      });
    }
  },

  // Crear un nuevo pedido
  async createRequest(req, res) {
    console.log("createRequest req.body: ", req.body);
    const {
      UserID,
      PriorityID,
      PriorityReason,
      RequestTypeID,
      RequestStateID,
      PaymentTypeID,
      PaymentStateID,
      Address,
      RequestedDate,
      RequestedToDate,
      DeliveredDate,
      Products,
      UserEmail,
      Total
    } = req.body;
    console.log("UserEmail:", UserEmail);
    //Calculo de los valores

    let totalQuantity = 0;
    let totalAmount = 0;

    Products.forEach((product) => {
      totalQuantity += product.quantity;
      totalAmount += product.price * product.quantity;
    });

    console.log("totalQuantity: ", totalQuantity);
    console.log("totalAmount: ", totalAmount);

    //se realiza el pago según lo elegido en tipo de pago
    //En la bdd el tipo de pago con tarjeta es 2

    const requestData = {
      UserID,
      PriorityID,
      PriorityReason,
      RequestTypeID,
      RequestStateID,
      PaymentTypeID,
      PaymentStateID,
      Address,
      RequestedDate,
      RequestedToDate,
      DeliveredDate,
      Total
    };

    try {
      const newRequestID = await Request.create(requestData);

      console.log("newRequest: ", newRequestID);
      try {
        for (const product of Products) {
          const { productID, quantity } = product;

          console.log(
            "productID newRequestID quantity: ",
            productID,
            newRequestID,
            quantity
          );

          const isCreated = await RequestProduct.createRequestProduct(
            productID,
            newRequestID,
            quantity
          );

          if (!isCreated) {
            console.error(`Error al insertar el producto con ID: ${productID}`);
            throw new Error(
              `Error al insertar el producto con ID: ${productID}`
            );
          }
        }

        //se crea el estado actual
        const isCreatedRequestState = await Request.createRequestState({
          RequestStateID,
          RequestID: newRequestID,
        });

        console.log("isCreatedRequestState: ", isCreatedRequestState);

        console.log("Todos los productos fueron insertados correctamente.");
      } catch (error) {
        console.error("Error al insertar los productos: ", error);
        throw new Error("Error al insertar los productos: ", error);
      }
      console.log("htmlMessage pre ");
      // Generar HTML dinámico
      let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">¡Gracias por tu confianza!</h2>
      <p>Estos son los productos de tu pedido:</p>
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">`;

      Products.forEach((product) => {
        html += `
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; max-width: 300px; text-align: center; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <img src="${product.image}" alt="${
          product.name
        }" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
        <h3 style="color: #4CAF50;">${product.name}</h3>
        <p><b>Precio:</b> $${product.price}</p>
        <p><b>Cantidad:</b> ${product.quantity}</p>
        <p><b>Total:</b> $${product.price * product.quantity}</p>
      </div>`;
      });

      html += `
      </div>
      <p style="margin-top: 20px;">Esperamos que disfrutes de tu compra. ¡Gracias por elegirnos!</p>
    </div>
    `;
      console.log("htmlMessage: ", html);

      let text =
        "Estimado cliente, su pedido de " +
        totalQuantity +
        " articulos por un valor de " +
        totalAmount +
        "Se ha procesado correctamente";
      const resSendEmail = await sendEmail(
        UserEmail,
        "Frish Alimentos Congelados | Notificación Proceso De Compra",
        text,
        html
      );

      console.log("resSendEmail: ", resSendEmail);

      res.status(201).json({
        status: true,
        msg: "Request created successfully",
        data: newRequestID,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error creating request",
        error: error.message,
      });
    }
  },

  async requestPaymentVerify(req, res) {
    console.log("createRequest req.body: ", req.body);
    const { RequestID } = req.body;

    try {
      //se crea el estado actual
      const isrequestPaymentVerify = await Request.requestPaymentVerify({
        RequestID,
      });

      console.log("isrequestPaymentVerify: ", isrequestPaymentVerify);

      res.status(200).json({
        status: true,
        msg: "Payment Verify requested successfully",
        data: isrequestPaymentVerify,
      });

      //return isrequestPaymentVerify;
    } catch (error) {
      console.error("Error al insertar los productos: ", error);
      res.status(500).json({
        status: false,
        msg: "Error updating requesting payment verify",
        error: error.message,
      });
    }
  },

  async updateRequest(req, res) {
    const { requestId } = req.params;
    const updatedData = req.body;

    try {
      const updatedRequest = await Request.createRequestState({
        RequestID: requestId,
        RequestStateID: updatedData.RequestStateID,
      });

      if(updatedData.RequestStateID == 4){
        // si el id del estado en 4 (Pago Erróneo) se pone el estado del pago automáticamente como fallido (3)
        const updatedPaymentState = await Request.updatePaymentState(
          requestId,
          3
        );
        console.log("updatedPaymentState in updatedRequest: ", updatedPaymentState);
      }

      if(updatedData.RequestStateID == 3){
        // si el id del estado en 3 (Órden validada) se pone el estado del pago automáticamente como Pago Exitoso (2)
        const updatedPaymentState = await Request.updatePaymentState(
          requestId,
          2
        );
        console.log("updatedPaymentState in updatedRequest: ", updatedPaymentState);
      }

      const updatedRequestType = await Request.updateRequestType(
        requestId,
        updatedData.RequestTypeID
      );

      const data = {
        updatedRequest,
        updatedRequestType,
      };
      res.status(200).json({
        status: true,
        msg: "Request updated successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error updating request",
        error: error.message,
      });
    }
  },

  async updateRequestPaymentState(req, res) {
    const { requestId } = req.params;
    const updatedData = req.body;

    try {
      //dependiendo del estado del pago se actualiza también el estado del pedido
      const updatedPaymentState = await Request.updatePaymentState(
        requestId,
        updatedData.PaymentStateID
      );

      let updatedRequest = null;
      if (updatedData.PaymentStateID == 1) {
        // 2 pago exitoso
        updatedRequest = await Request.createRequestState({
          RequestID: requestId,
          RequestStateID: 2,
        });
      } else if (updatedData.PaymentStateID == 2) {
        // 3 pago fallido
        updatedRequest = await Request.createRequestState({
          RequestID: requestId,
          RequestStateID: 3,
        });
      } else if (updatedData.PaymentStateID == 3) {
        // 3 pago fallido
        updatedRequest = await Request.createRequestState({
          RequestID: requestId,
          RequestStateID: 4,
        });
      }

      const data = {
        updatedPaymentState,
        updatedRequest,
      };
      res.status(200).json({
        status: true,
        msg: "Payment State updated successfully",
        data,
      });
    } catch (error) {
      console.error("Payment State updating request: ", error);
      res.status(500).json({
        status: false,
        msg: "Payment State updating request",
        error: error.message,
      });
    }
  },

  // Eliminar un pedido
  async deleteRequest(req, res) {
    const { requestId } = req.params;
    try {
      const result = await Request.delete(requestId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error deleting request",
        error: error.message,
      });
    }
  },
};

module.exports = requestController;
