// models/userModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");
const bcrypt = require("bcrypt");

class UserModel {
  // Obtener todos los usuarios
  static async getAllUsers() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [User]");
    return result.recordset;
  }

  static async getAdminUsers() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [User] Where RolID = 1");
    return result.recordset;
  }

  static async getFinancialUsers() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [User] Where RolID = 3");
    return result.recordset;
  }

  static async getWineryUsers() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [User] Where RolID = 4");
    return result.recordset;
  }

  static async getDeliveryUsers() {
    const pool = await databaseInstance.getConnection();
    const result = await pool.request().query("SELECT * FROM [User] Where RolID = 5");
    return result.recordset;
  }


  // Obtener un usuario por ID
  static async getUserById(userId) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("UserID", sql.Int, userId)
        .query("SELECT * FROM [User] WHERE UserID = @UserID");

      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error al obtener el usuario por ID:", error);
      throw new Error("Error al obtener el usuario");
    }
  }

  // Crear un nuevo usuario
  static async createUser(userData) {
    const {
      name,
      email,
      password,
      bornDate,
      address,
      cellphone,
      rolID,
      personIdentification,
    } = userData;

    try {
      // Genera un hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      const pool = await databaseInstance.getConnection();

      // Inserción del nuevo usuario
      await pool
        .request()
        .input("Name", sql.VarChar(100), name)
        .input("Email", sql.VarChar(100), email)
        .input("Password", sql.VarChar(255), hashedPassword)
        .input("BornDate", sql.Date, bornDate)
        .input("Address", sql.Text, address)
        .input("Cellphone", sql.VarChar(15), cellphone)
        .input("RolID", sql.Int, rolID)
        .input("PersonIdentification", sql.VarChar(20), personIdentification)
        .query(`
          INSERT INTO [User] (Name, Email, Password, BornDate, Address, Cellphone, RolID, PersonIdentification)
          VALUES (@Name, @Email, @Password, @BornDate, @Address, @Cellphone, @RolID, @PersonIdentification)
        `);

      const result = await pool
        .request()
        .input("Email", sql.VarChar(100), email)
        .query("SELECT UserID FROM [User] WHERE Email = @Email");

      const userID = result.recordset[0]?.UserID;

      return {
        success: true,
        message: "Usuario creado exitosamente",
        userID,
      };
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return {
        success: false,
        message: "Error al crear el usuario",
        error: error.message,
      };
    }
  }

  // Actualizar usuario
  static async updateUser(userId, updatedData) {
    console.log("updatedData: ", updatedData);
    const { Name, Email, BornDate, Address, Cellphone, RolID, PersonIdentification } = updatedData;

    try {
      const pool = await databaseInstance.getConnection();
      await pool
        .request()
        .input("UserID", sql.Int, userId)
        .input("Name", sql.VarChar(100), Name)
        .input("Email", sql.VarChar(100), Email)
        .input("BornDate", sql.Date, BornDate)
        .input("Address", sql.Text, Address)
        .input("Cellphone", sql.VarChar(15), Cellphone)
        .input("RolID", sql.Int, RolID)
        .input("PersonIdentification", sql.VarChar(20), PersonIdentification)
        .query(`
          UPDATE [User]
          SET Name = @Name, Email = @Email, BornDate = @BornDate, Address = @Address,
              Cellphone = @Cellphone, RolID = @RolID, PersonIdentification = @PersonIdentification
          WHERE UserID = @UserID
        `);

      return { success: true, message: "Usuario actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return { success: false, message: "Error al actualizar el usuario", error: error.message };
    }
  }

  // Eliminar usuario
  static async deleteUser(userId) {
    try {
      const pool = await databaseInstance.getConnection();
      await pool.request().input("UserID", sql.Int, userId).query("DELETE FROM [User] WHERE UserID = @UserID");

      return { success: true, message: "Usuario eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      return { success: false, message: "Error al eliminar el usuario", error: error.message };
    }
  }

  // Loguear usuario
  static async loginUser(email, password) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("Email", sql.VarChar(100), email)
        .query(`
          SELECT Rol.Name AS RolName, [User].*
          FROM [User]
          JOIN Rol ON [User].RolID = Rol.RolID
          WHERE [User].Email = @Email
        `);

      const user = result.recordset[0];
      if (!user) {
        return { success: false, message: "Usuario no encontrado" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        return { success: false, message: "Contraseña incorrecta" };
      }

      const { Password, ...userData } = user;
      return { success: true, user: userData };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error en el proceso de login", error: error.message };
    }
  }

  // Obtener usuarios por rol
  static async getUsersByRole(rolID) {
    try {
      const pool = await databaseInstance.getConnection();
      const result = await pool
        .request()
        .input("RolID", sql.Int, rolID)
        .query("SELECT * FROM [User] WHERE RolID = @RolID");

      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuarios por rol:", error);
      throw new Error("Error al obtener usuarios");
    }
  }
}

module.exports = UserModel;

