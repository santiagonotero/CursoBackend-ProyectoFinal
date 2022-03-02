const {Router} = require ('express')
const routerCarrito = Router()
const Carrito = require ('../model/carrito')

routerCarrito.post('/', async (req,res)=>{
    const {body} = req
    await Carrito.crearCarrito(body)
    res.sendStatus(200)
})

routerCarrito.get('/:id/productos', async (req,res)=>{   //Me permite listar todos los productos guardados en el carrito
    await Carrito.readData()
    const carrito = Carrito.data
    try{
        if(carrito[req.params.id-1]){
            res.send(carrito[req.params.id-1])
        }
        else{
            res.sendStatus(404)
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
    const { body } = req
    try{
        await Carrito.agregarProducto(req.params.id, body)
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
        await Carrito.borrarProducto(id, id_prod)
        res.sendStatus(200)
    }
    catch(err){
        if(err.message === 'Carrito not found'){
            res.sendStatus(404)
        }
        else{
            res.sendStatus(500)
        }
    }
})

module.exports = routerCarrito