const {Router} = require ('express')
const routerProductos = Router()
const Productos = require ('../model/productos')

let administrador = true

routerProductos.get('/', async (req, res) => {
    await Productos.readData()
    if (Productos.data.length){
        res.send(Productos.data).status(200)
    }
    else{
        res.send('No hay productos disponibles').status(200)
    }
})

routerProductos.get('/:id', async (req, res) => {
    await Productos.leerProducto(req.params)
    if(Productos.data.length){
        res.send(Productos.data).status(200)
    }    
    else{
        res.send('Producto no encontrado').status(200)
    }
})

routerProductos.post('/', async (req, res) => {

    if(administrador) {
        let {body} = req
        Productos.agregarProducto(body)
        res.sendStatus(200)
    }
    else{
        res.send({ error: -1, descripcion: "ruta '/', método POST no autorizada"}).status(401)
    }
})

routerProductos.put('/:id', async (req, res) => {

    if(administrador) {
        const id_prod = JSON.parse(req.params.id)

        try{
            const modificado = await Productos.reemplazarProducto(id_prod, req.body)
            if(modificado){
                res.send(`1 documento modificado`).status(200)
            }
            else{
                res.send('No se modificó ningún ítem')
            }
        }

        catch(err){
            if (err.message ='Error: Producto no encontrado'){
                res.send( `${err.message}`).status(200)
            }
            else{
                res.send(500)
            }
        }    
    }
    else{
        res.send({ error: -1, descripcion: "ruta '/', método PUT no autorizada"}).status(401)
    }
})

routerProductos.delete('/:id', async (req, res) => {

    if(administrador) {
        console.log(req.params.id)
        await Productos.eliminarProducto(req.params.id)
        res.send('Producto eliminado').status(200)
    }
    else{
        res.send({ error: -1, descripcion: "ruta '/:id', método DELETE no autorizada"}).status(401)
    }
})

module.exports = routerProductos