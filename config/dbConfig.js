const sql = require("mssql");
require("dotenv").config();

class Database {
  constructor() {
    this.poolPromise = null;
    this.config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      port: 1433,
      options: {
        encrypt: true,
        trustServerCertificate: true, // Solo para desarrollo local
      },
      user: process.env.DB_USER, // Nombre de usuario del login de SQL Server
      password: process.env.DB_PASSWORD, // Contraseña para ese login
    };
  }

  // Método para obtener la conexión
  async getConnection() {
    //console.log("this.poolPromise pre: ", this.poolPromise);

    if (!this.poolPromise) {
      this.poolPromise = sql
        .connect(this.config)
        .then((pool) => {
          console.info(
            `Conexión a la base de datos ${this.config.database} establecida`
          );
          return pool;
        })
        .catch((err) => {
          console.error("Error al conectar a la base de datos", err);
          throw err; // Re-lanza el error para manejo posterior
        });
    }

    //console.log("this.poolPromise post: ", this.poolPromise);
    return this.poolPromise;
  }

  // Función para cerrar la conexión
  async disconnect() {
    try {
      if (sql && sql.close) {
        await sql.close();
        this.poolPromise = null; // Resetear la promesa de conexión
        console.info("Conexión cerrada con éxito");
      }
    } catch (error) {
      console.error("Error al cerrar la conexión:", error);
    }
  }
}

// Exportar una instancia de la clase Database
const databaseInstance = new Database();
module.exports = { databaseInstance, sql };