const {Router} = require ('express')
const routerCarrito = Router()
const Carrito = require ('../model/carrito')
const Productos = require ('../model/productos')
const sendWhatsapp = require('../notifications/whatsapp')
const MailSender = require('../notifications/email')

routerCarrito.post('/', async (req,res)=>{
    const IdCarrito = await Carrito.crearCarrito()
    res.send(`ID del nuevo carrito : ${IdCarrito}`).status(200)
})

routerCarrito.get('/:id/productos', async (req,res)=>{   //Me permite listar todos los productos guardados en el carrito

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
        console.log(err)
    }
})

routerCarrito.delete('/:id', async (req,res)=>{
    await Carrito.eliminarCarrito(req.params.id)
    res.sendStatus(200)
})

routerCarrito.post('/:id/productos', async (req,res)=>{

    const idCarrito = req.user.idCarrito
    
    try{
        await Carrito.agregarProducto(req.params.id, idCarrito)//, ...body)
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
    const {id, id_prod} = req.params
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

    const listaCarrito = {...await Carrito.leerCarrito(req.user.idCarrito)}
    const listaArticulos = listaCarrito[0].productos
    let arrayArticulos =[]
    let precioTotal = 0
    
    for(let i=0; i<listaArticulos.length; i++) {
        const detalleProducto = {...await Productos.leerProducto(listaArticulos[i])}
        arrayArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio, codigo: listaArticulos[i]})
        precioTotal +=JSON.parse(detalleProducto[0].precio)
    } 
    
    const usuario =req.user
    
    //Mandar mensaje por sms y whatsapp
    sendWhatsapp(usuario, arrayArticulos, precioTotal)
    
    //Enviar notificación por mail al administrador
    MailSender.nuevaCompra(usuario, arrayArticulos, precioTotal)
    
    await Carrito.vaciarCarrito(req.user.idCarrito)

    res.redirect("/cartok")
})

module.exports = routerCarrito
