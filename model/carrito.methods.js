const Carrito = require ('../model/carrito')
const Productos = require ('../model/productos')
const MailSender = require('../notifications/email')
const logger = require("../Logs/winston")

module.exports ={
    getCart: async (req, res) => {
            try {
                const carrito = await Carrito.leerCarrito(req.user.email)
                let listaArticulos = {...carrito}[0].productos     
                let pedidoArticulos = []
                let precioTotal = 0
                for(let i=0; i<listaArticulos.length; i++) {
                    const detalleProducto = {...await Productos.leerProducto(listaArticulos[i].item)}
                    pedidoArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio * listaArticulos[i].cantidad, cantidad: listaArticulos[i].cantidad, codigo: detalleProducto[0].codigo})
                    precioTotal +=JSON.parse(pedidoArticulos[i].precio)
                } 
                res.render('carrito', { layout:'carrito', carrito: pedidoArticulos, precioTotal: precioTotal})
            }
            catch(err){
                logger.error(err)
                res.render('error', {layout: 'error', error: err.message}).status(200)
            }
            res.status(200)
        },
    postCart: async (req,res)=>{
            const IdCarrito = await Carrito.crearCarrito()
            res.send(`ID del nuevo carrito : ${IdCarrito}`).status(200)
        },
    listProducts: async (req,res)=>{   //Me permite listar todos los productos guardados en el carrito
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
                res.render('error', {layout: 'error', error: err.message}).status(200)
            }
        },
    deleteCart: async (req,res)=>{
            await Carrito.eliminarCarrito(req.params.id)
            res.sendStatus(200)
        },
    addProduct: async (req,res)=>{
            try{
                await Carrito.agregarProducto(req.params.id, req.user.email)
                res.sendStatus(201)
            }
            catch(err){
                if(err.message == 'Carrito not found'){
                    logger.error('Error: No se encontró carrito - ' + err)
                    res.render('error', {layout: 'error', error: err.message}).status(200)
                    res.sendStatus(404)
                }
                else{
                    res.sendStatus(500)
                }
            }
        },
    deleteProduct: async (req,res)=>{
            const {id} = req.params
            try{
                let listadoCarrito = await Carrito.leerProductos(id) //Cargo los artículos del carrito del
        
                res.send(listadoCarrito).status(200)
            }
            catch(err){
                if(err.message === 'Carrito no encontrado'){
                    logger.error('Error: No se encontró carrito - ' + err)
                    res.render('error', {layout: 'error', error: err.message}).status(200)
                }
                else{
                    res.sendStatus(500)
                }
            }
        },
    endSelling: async(req, res) => {
            try{
                const carrito = await Carrito.leerCarrito(req.user.email)
                let listaArticulos = {...carrito}[0].productos     
                let pedidoArticulos = []
                let precioTotal = 0
                let arrayCantidades = []
                for(let i=0; i<listaArticulos.length; i++) {
                    const detalleProducto = {...await Productos.leerProducto(listaArticulos[i].item)}
                    pedidoArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio * listaArticulos[i].cantidad, cantidad: listaArticulos[i].cantidad, codigo: detalleProducto[0].codigo})
                    precioTotal +=JSON.parse(pedidoArticulos[i].precio)
                    arrayCantidades.push(listaArticulos[i].cantidad)
                } 
                const usuario =req.user
                MailSender.nuevaCompra(usuario, pedidoArticulos, precioTotal, arrayCantidades)
                await Carrito.vaciarCarrito(req.user.email)
                res.send('Ok').status(200)
            }
            catch(err){
                logger.error(err)
            }
        },
    getEndSelling: (req, res) => {
            res.render('cartok', {layout:'cartok'})
    }
}