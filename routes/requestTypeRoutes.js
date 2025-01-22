// routes/requestTypeRoutes.js
const express = require("express");
const router = express.Router();
const RequestTypeController = require("../controllers/requestTypeController");

// Ruta para obtener todos los tipos de solicitud
router.get("/request-types", RequestTypeController.getAllRequestTypes);

// Ruta para registrar un nuevo tipo de solicitud
router.post(
  "/request-types/register",
  RequestTypeController.registerRequestType
);

// Ruta para obtener un tipo de solicitud por su ID
router.get("/request-types/:id", RequestTypeController.getRequestTypeById);

// Ruta para actualizar un tipo de solicitud por su ID
router.put("/request-types/:id", RequestTypeController.updateRequestType);

// Ruta para eliminar un tipo de solicitud por su ID
//router.delete("/request-types/:id", RequestTypeController.deleteRequestType);
router.delete(
  "/request-types/:id",
  (req, res, next) => {
    console.log("[DEBUG DELETE] Llega solicitud DELETE a /request-types/:id");
    console.log("Params:", req.params);
    console.log("Headers:", req.headers);
    next(); // Continúa hacia el controlador
  },
  RequestTypeController.deleteRequestType
);

module.exports = router;
