const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  })


const accountSid = process.env.TWILIO_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken); 
 
function sendWhatsapp(user, arrayArticulos, precioTotal){

    let msgBody = `Hola!!! Tenemos buenas noticias para tí!!!. Un cliente acaba de efectuar una compra en el sitio web. Te damos los detalles de esta compra:
    
    Nombre del cliente: ${user.nombre}, 
    Dirección: ${user.direccion},
    Teléfono: ${user.telefono}, 
    Email: ${user.email}

    Y estos son los productos de su carrito: \n
    `
    for(let i = 0; i < arrayArticulos.length; i++){
        msgBody += `Artículo: ${arrayArticulos[i].nombre} - Código: ${arrayArticulos[i].codigo} - Precio del artículo: ${arrayArticulos[i].precio} \n`
    }
    

    msgBody += `\n El valor total de la compra es de ARS${precioTotal}`

    client.messages 
        .create({ 
            body: msgBody, 
            from: process.env.TWILIO_FROM,       
            to: process.env.TWILIO_TO
        }) 
        .then(message => console.log(message.sid)) 
        .done()
    }

module.exports = sendWhatsapp