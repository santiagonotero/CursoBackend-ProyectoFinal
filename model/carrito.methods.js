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
            }
            res.status(200)
        },
    postCart: async (req,res)=>{
            const IdCarrito = await Carrito.crearCarrito()
            res.send(`ID del nuevo carrito : ${IdCarrito}`).status(200)
        },
    listProducts: async (req,res)=>{   //Me permite listar todos los productos guardados en el carrito
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
                    res.sendStatus(404)
                }
                else{
                    res.sendStatus(500)
                }
            }
        },
    endSelling: async(req, res) => {
        console.log('/finalizar compra')
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
    }
}