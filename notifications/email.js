const nodemailer = require('nodemailer')
const config = require('../config/index')

const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  })


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


  async nuevaCompra(user, arrayArticulos, precioTotal) {

    let msgBody = `<h1>Felicitaciones!!! Un cliente ha efectuado una nueva compra en tu comercio online</h1>
    <p>Hola!!! Tenemos buenas noticias para tí!!!. Un cliente acaba de efectuar una compra en el sitio web. Te damos los detalles de esta compra:</p>
    <ul>
        <li>Nombre del cliente: ${user.nombre} </li>
        <li>Dirección: ${user.direccion}</li>
        <li>Teléfono: ${user.telefono}</li> 
        <li>Email: ${user.email}</li>
    </ul>
    <p>Y estos son los productos de su carrito:</p>
    <ul>`

    for(let i = 0; i < arrayArticulos.length; i++){
        msgBody += `<li>Artículo: ${arrayArticulos[i].nombre} - Código: ${arrayArticulos[i].codigo} - Precio del artículo: ${arrayArticulos[i].precio}</li>`
    }
    

    msgBody += `</ul>
                <p>El valor total de la compra es de ARS${precioTotal}</p>`

    const mailOptions = {
      from: "Notificaciones <contacto@tiendavirtual.com>",
      subject: "Nueva compra desde el sitio web",
      to: process.env.GMAIL_ADDRESS,
      html: msgBody,
      attachments: [{
      }]
    }

    const response = await this.transporter.sendMail(mailOptions)
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