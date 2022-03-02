const {Router} = require ('express')
const routerProductos = Router()
const Productos = require ('../model/productos')

let administrador = true

routerProductos.get('/', async (req, res) => {
    await Productos.readData()
    res.send(Productos.data).status(200)
})

routerProductos.get('/:id', async (req, res) => {
    await Productos.readData()
    const producto = Productos.data.find(p => JSON.parse(p.id) === JSON.parse(req.params.id))
    if(producto){
        res.send(producto)
    }    
    else{
        res.send('Producto no encontrado')
    }
})

routerProductos.post('/', async (req, res) => {

    if(administrador) {
        const {body} = req
        Productos.agregarProducto(body)
        res.sendStatus(200)
    }
    else{
        res.send({ error: -1, descripcion: "ruta '/', método POST no autorizada"})
    }
})

routerProductos.put('/:id', async (req, res) => {

    if(administrador) {
        const id_prod = JSON.parse(req.params.id)

        try{
            await Productos.reemplazarProducto(id_prod, req.body)
            res.sendStatus(200)
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
        res.send({ error: -1, descripcion: "ruta '/', método PUT no autorizada"})
    }
})

routerProductos.delete('/:id', async (req, res) => {

    if(administrador) {
        await Productos.eliminarProducto(req.params.id)
        res.send('Producto eliminado').status(200)
    }
    else{
        res.send({ error: -1, descripcion: "ruta '/:id', método DELETE no autorizada"})
    }
})

module.exports = routerProductos