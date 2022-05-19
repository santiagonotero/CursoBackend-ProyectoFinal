const {Router} = require ('express')
const routerCarrito = Router()
const Carrito = require ('../model/carrito')

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

routerCarrito.get('/finalizarcompra', async(req,res) => {
    
    //Mandar mensaje por sms y whatsapp
    
    await Carrito.vaciarCarrito(req.user.idCarrito)


    res.sendStatus(200)
})

module.exports = routerCarrito