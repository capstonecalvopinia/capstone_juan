const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, subject, text, html) {
  try {
    console.log("sendEmail en inicio");
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Puerto del servidor SMTP (usualmente 587 o 465)
      secure: false, // Usa true para el puerto 465, falso para otros

      service: "gmail", // Puedes usar otro servicio de correo
      auth: {
        user: process.env.GMAIL_ADDcS, // Tu correo electrónico
        pass: process.env.GMAIL_APP_PASS, // Contraseña de tu correo
      },
      tls: {
        rejectUnauthorized: false, // Permite certificados autofirmados
      },
    });

    // Configurar el contenido del correo
    let mailOptions = {
      from: process.env.GMAIL_ADDRESS, // Remitente
      to, // Destinatario
      subject, // Asunto
      text, // Cuerpo en texto plano
      html, // Cuerpo en HTML
    };
    console.log("to: ", to);
    console.log("subject: ", subject);
    console.log("text: ", text);
    console.log("html: ", html);
    // Enviar el correo
    let info = await transporter.sendMail(mailOptions);
    console.log("info: ", info);
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}

module.exports = { sendEmail };