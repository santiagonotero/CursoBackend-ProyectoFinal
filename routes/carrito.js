const {Router} = require ('express')
const logger = require("../Logs/winston")
const routerCarrito = Router()
const Carrito = require ('../model/carrito')
const Productos = require ('../model/productos')
const MailSender = require('../notifications/email')

routerCarrito.post('/', async (req,res)=>{
    const IdCarrito = await Carrito.crearCarrito()
    res.send(`ID del nuevo carrito : ${IdCarrito}`).status(200)
})

routerCarrito.get('/:id/productos', async (req,res)=>{   //Me permite listar todos los productos guardados en el carrito
    console.log(req.params.id)
    await Carrito.leerCarrito(req.params.id)
    try{
        if(Carrito.data.length){
            res.send(Carrito.data[0].productos).status(200)
        }
        else{
            res.send('No existe carrito').status(404)
        }
    }
    catch(err){
        logger.error(err)
    }
})

routerCarrito.delete('/:id', async (req,res)=>{
    await Carrito.eliminarCarrito(req.params.id)
    res.sendStatus(200)
})

routerCarrito.post('/:id/productos', async (req,res)=>{
    try{
        await Carrito.agregarProducto(req.params.id, req.user.email)
        res.sendStatus(201)
    }
    catch(err){
        if(err.message == 'Carrito not found'){
            res.sendStatus(404)
        }
        else{
            res.sendStatus(500)
        }
    }
})

routerCarrito.delete('/:id/productos/:id_prod', async (req,res)=>{
    const {id} = req.params
    try{
        let listadoCarrito = await Carrito.leerProductos(id) //Cargo los artículos del carrito del

        res.send(listadoCarrito).status(200)
    }
    catch(err){
        if(err.message === 'Carrito no encontrado'){
            res.sendStatus(404)
        }
        else{
            res.sendStatus(500)
        }
    }
})

routerCarrito.post('/finalizarcompra', async(req, res) => {

    const carrito = await Carrito.leerCarrito(req.user.email)
    let listaArticulos = {...carrito}[0].productos     
    let pedidoArticulos = []
    let precioTotal = 0
    for(let i=0; i<listaArticulos.length; i++) {
        const detalleProducto = {...await Productos.leerProducto(listaArticulos[i].item)}
        pedidoArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio * listaArticulos[i].cantidad, cantidad: listaArticulos[i].cantidad, codigo: detalleProducto[0].codigo})
        precioTotal +=JSON.parse(pedidoArticulos[i].precio)
    } 
    
    const usuario =req.user
    MailSender.nuevaCompra(usuario, pedidoArticulos, precioTotal)
    
    await Carrito.vaciarCarrito(req.user.email)

    res.redirect(200, '/cartok', {render: 'cartok'})
})

module.exports = routerCarrito