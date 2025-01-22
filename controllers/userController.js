// controllers/userController.js
const UserModel = require("../models/userModel");

class UserController {
  // Obtener todos los usuarios
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener los usuarios", error });
    }
  }

  static async getFinancialUsers(req, res) {
    try {
      const users = await UserModel.getFinancialUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener los usuarios financieros", error });
    }
  }

  // Obtener un usuario por ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ msg: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el usuario", error });
    }
  }

  // Registrar un nuevo usuario
  static async registerUser(req, res) {
    try {
      const {
        name,
        email,
        password,
        bornDate,
        address,
        cellphone,
        rolID,
        personIdentification,
      } = req.body;

      // Validación básica
      if (!name || !email || !password || !rolID) {
        return res
          .status(422)
          .json({ msg: "Nombre, email, contraseña y rol son obligatorios" });
      }

      const newUser = {
        name,
        email,
        password,
        bornDate,
        address,
        cellphone,
        rolID,
        personIdentification,
      };

      const result = await UserModel.createUser(newUser);

      if (result.success) {
        res.status(201).json({
          msg: "Usuario registrado exitosamente",
          userID: result.userID,
        });
      } else {
        res
          .status(500)
          .json({ msg: "Error al registrar el usuario", error: result.error });
      }
    } catch (error) {
      console.error("Error en registerUser:", error);
      res
        .status(500)
        .json({ msg: "Error al registrar el usuario", error: error.message });
    }
  }

  // Iniciar sesión de usuario
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res
          .status(422)
          .json({ msg: "Email y contraseña son obligatorios" });
      }

      const result = await UserModel.loginUser(email, password);

      if (result.success) {
        res.status(200).json({
          msg: "Inicio de sesión exitoso",
          user: result.user,
        });
      } else {
        res.status(401).json({ msg: result.message });
      }
    } catch (error) {
      console.error("Error en loginUser:", error);
      res.status(500).json({
        msg: "Error en el proceso de login",
        error: error.message,
      });
    }
  }

  // Actualizar un usuario
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      console.log("id in updateUser : ", id);
      const updatedData = req.body;
      console.log("updatedData in updateUser : ", updatedData);
      const result = await UserModel.updateUser(id, updatedData);

      if (result.success) {
        res.json({ msg: "Usuario actualizado exitosamente" });
      } else {
        res.status(500).json({ msg: "Error al actualizar el usuario" });
      }
    } catch (error) {
      console.error("Error en updateUser:", error);
      res.status(500).json({ msg: "Error al actualizar el usuario", error: error.message });
    }
  }

  // Eliminar un usuario
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await UserModel.deleteUser(id);

      if (result.success) {
        res.json({ msg: "Usuario eliminado exitosamente" });
      } else {
        res.status(500).json({ msg: "Error al eliminar el usuario" });
      }
    } catch (error) {
      console.error("Error en deleteUser:", error);
      res.status(500).json({ msg: "Error al eliminar el usuario", error: error.message });
    }
  }

  // Obtener usuarios por rol
  static async getUsersByRole(req, res) {
    try {
      const { rolID } = req.params;
      
      const users = await UserModel.getUsersByRole(rolID);

      if (users.length > 0) {
        res.json(users);
      } else {
        res.status(404).json({ msg: "No se encontraron usuarios con el rol especificado" });
      }
    } catch (error) {
      console.error("Error en getUsersByRole:", error);
      res.status(500).json({ msg: "Error al obtener usuarios por rol", error: error.message });
    }
  }
}

module.exports = UserController;
