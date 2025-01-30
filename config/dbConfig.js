const sql = require("mssql");
require("dotenv").config();

class Database {
  constructor() {
    if (!Database.instance) {
      this.poolPromise = null;
      this.config = {
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        port: 1433,
        options: {
          encrypt: true,
          trustServerCertificate: true, 
        },
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };
      Database.instance = this;
    }

    return Database.instance;
  }

  async getConnection() {
    if (!this.poolPromise) {
      this.poolPromise = sql
        .connect(this.config)
        .then((pool) => {
          console.info(`Conectado a la BD: ${this.config.database}`);
          return pool;
        })
        .catch((err) => {
          console.error("Error de conexión:", err);
          throw err;
        });
    }
    return this.poolPromise;
  }

  async disconnect() {
    try {
      if (sql && sql.close) {
        await sql.close();
        this.poolPromise = null;
        console.info("Conexión cerrada con éxito");
      }
    } catch (error) {
      console.error("Error al cerrar la conexión:", error);
    }
  }
}

// Exportar una única instancia
const databaseInstance = new Database();
module.exports = { databaseInstance, sql };
