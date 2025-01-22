// controllers/rolController.js
const RolModel = require("../models/rolModel");

class RolController {
  // Obtener todos los roles
  static async getAllRoles(req, res) {
    try {
      const roles = await RolModel.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener los roles", error });
    }
  }

  // Obtener un rol por ID
  static async getRoleById(req, res) {
    try {
      const { rolID } = req.params;

      const result = await RolModel.getRoleById(rolID);

      if (result.success) {
        res.json(result.role);
      } else {
        res.status(404).json({ msg: result.message });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el rol", error });
    }
  }

  // Crear un nuevo rol
  static async createRole(req, res) {
    try {
      const { Name, Description } = req.body;

      // Validación básica
      if (!Name) {
        return res.status(422).json({ msg: "El nombre del rol es obligatorio" });
      }

      const newRole = { Name, Description };
      const result = await RolModel.createRole(newRole);

      if (result.success) {
        res.status(201).json({
          msg: "Rol creado exitosamente",
          roleId: result.roleId,
        });
      } else {
        res.status(500).json({ msg: "Error al crear el rol", error: result.error });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al crear el rol", error: error.message });
    }
  }

  // Actualizar un rol por ID
  static async updateRole(req, res) {
    try {
      const { rolID } = req.params;
      const { Name, Description } = req.body;

      console.log("actualizando rol en controlador");
      console.log("RolID:", rolID);
      console.log("name:", Name);
      console.log("description:", Description);

      // Validación básica
      if (!Name) {
        return res.status(422).json({ msg: "El nombre del rol es obligatorio" });
      }

      const updatedData = { Name, Description };
      const result = await RolModel.updateRole(rolID, updatedData);

      if (result.success) {
        res.json({ msg: "Rol actualizado exitosamente" });
      } else {
        res.status(404).json({ msg: result.message });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al actualizar el rol", error });
    }
  }

  // Eliminar un rol por ID
  static async deleteRole(req, res) {
    try {
      const { rolID } = req.params;

      const result = await RolModel.deleteRole(rolID);

      if (result.success) {
        res.json({ msg: "Rol eliminado exitosamente" });
      } else {
        res.status(404).json({ msg: result.message });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar el rol", error });
    }
  }
}

module.exports = RolController;
