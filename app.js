const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routerCarrito = require('./routes/carrito')
const routerProductos = require('./routes/productos')

const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./DBconfig/Mongo")

const Firebase = require('./firebase')

const PORT= process.env.PORT || 8080

// Conexión a MongoDB

mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
    console.log("Conectado con base de datos MongoDB")

    // Conexión a Firebase

    Firebase.initFirebase()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true}))

        app.use('/api/carrito', routerCarrito)
        app.use('/api/productos', routerProductos)

        app.listen(PORT, ()=>{
            console.log(`Realizando conexión con el puerto ${PORT}`)
    })

})        

.catch((err)=>{
        console.log("error en Mongo", err)
})

