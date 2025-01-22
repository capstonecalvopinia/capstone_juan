// routes/routes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const RolController = require("../controllers/rolController");

// Rutas para UserController
// router.get("/users", UserController.getAllUsers);
// router.post("/users/register", UserController.registerUser);
// router.post("/users/login", UserController.loginUser);

// Rutas para RolController
router.get("/roles", RolController.getAllRoles);             // Obtener todos los roles
router.get("/roles/:rolID", RolController.getRoleById);      // Obtener un rol por ID
router.post("/roles", RolController.createRole);             // Crear un nuevo rol
router.put("/roles/:rolID", RolController.updateRole);       // Actualizar un rol por ID
router.delete("/roles/:rolID", RolController.deleteRole);    // Eliminar un rol por ID

module.exports = router;
