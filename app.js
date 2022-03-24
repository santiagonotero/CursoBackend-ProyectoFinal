// >>Consigna: Basándose en los contenedores ya desarrollados (memoria, archivos) 
// desarrollar dos contenedores más (que cumplan con la misma interfaz) que permitan realizar 
// las operaciones básicas de CRUD en MongoDb (ya sea local o remoto) y en Firebase. 
// Luego, para cada contenedor, crear dos clases derivadas, una para trabajar con 
// Productos, y otra para trabajar con Carritos.

// >>Aspectos a incluir en el entregable: 
// A las clases derivadas de los contenedores se las conoce como DAOs (Data Access Objects), 
// y pueden ir todas incluidas en una misma carpeta de ‘datos’.
// En la carpeta de datos, incluir un archivo que importe todas las clases y exporte una 
// instancia de dao de productos y una de dao de carritos, según corresponda. 
// Esta decisión se tomará en base al valor de una variable de entorno cargada al momento de 
// ejecutar el servidor (opcional: investigar el uso de imports dinámicos).
// HECHO--> Incluir un archivo de configuración (config) que contenga los datos correspondientes para 
//          conectarse a las bases de datos o medio de persistencia que corresponda.

// >>Opcional:
// Hacer lo mismo para bases de datos relacionales: MariaDB/SQLite3.



const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routerCarrito = require('./routes/carrito')
const routerProductos = require('./routes/productos')

const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./config")

const PORT= process.env.PORT || 8080

//mongoose.connect("mongodb+srv://santiagonotero:<password>@cluster0.pzszz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(()=>{
mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
//Acá va mongoose.connect(...).then(()=>{

    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))

    app.use('/api/carrito', routerCarrito)
    app.use('/api/productos', routerProductos)


    app.listen(PORT, ()=>{
        console.log(`Realizando conexión con el puerto ${PORT}`)
    })

    console.log("Conectado con base de datos MongoDB")

})        //Esto viene del then()

 .catch((err)=>{
        console.log("error en Mongo", err)
})