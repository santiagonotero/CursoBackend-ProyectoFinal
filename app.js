const express = require('express')
const app = express()
const routerCarrito = require('./routes/carrito')
const routerProductos = require('./routes/productos')

const PORT= process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/carrito', routerCarrito)
app.use('/api/productos', routerProductos)


app.listen(PORT, ()=>{
    console.log(`Realizando conexión con el puerto ${PORT}`)
})
