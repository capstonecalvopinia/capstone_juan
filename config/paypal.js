const { Client, Environment, LogLevel } = require("@paypal/paypal-server-sdk");
require("dotenv").config();
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox, // Cambia a Environment.Production en producción
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

module.exports = { client };
