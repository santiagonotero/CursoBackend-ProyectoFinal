const nodemailer = require('nodemailer')
const config = require('../config/index')

const TEST_EMAIL = config.mail.GMAIL_ADDRESS

class MailSender {

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PWD
      },    
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async send(template, email) {
    const mailOptions = {
      from: "Notificaciones <contacto@tiendavirtual.com>",
      subject: "Tu pedido está siendo procesado",
      to: email,
      html: 'template',
      attachments: [{
        path: __dirname + '/pedido.png'
      }]
    }

    const response = await this.transporter.sendMail(mailOptions)
    console.log(response)
  }

  async newUserMail(nombre, edad, direccion, telefono, email) {
    const mailOptions = {
      from: "Notificaciones <contacto@tiendavirtual.com>",
      subject: "Nuevo usuario registrado",
      to: process.env.GMAIL_ADDRESS,
      html: `<h1>Nuevo usuario registrado</h1>
        <p>Se acaba de registrar un nuevo usuario. Sus datos son los siguientes:</p>
        <ul>
        <li>Nombre: ${nombre}</li>
        <li>Edad: ${edad}</li>
        <li>Direccion de correo electrónico: ${email}</li>
        <li>Domicilio: ${direccion}</li>
        <li>Número de teléfono: ${telefono}</li>
        </ul>`
    }

    const response = await this.transporter.sendMail(mailOptions)
  }
}

module.exports = new MailSender()