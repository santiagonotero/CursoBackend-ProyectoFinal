const Productos = require ('./productos')

module.exports={
    getProducts: async (req, res) => {
            await Productos.readData()
            if (Productos.data.length){
                res.send(Productos.data).status(200)
            }
            else{
                res.send('No hay productos disponibles').status(200)
            }
        },
    getProductsById: async (req, res) => {
            await Productos.leerProducto(req.params)
            if(Productos.data.length){
                res.send(Productos.data).status(200)
            }    
            else{
                res.send('Producto no encontrado').status(200)
            }
        },
    postProductsByCategory: async (req, res) => {
            console.log('POST -> Categoría')
            console.log(req.params.categoria)
            const filtrado = await Productos.buscarPorCategoria(req.params.categoria)
            res.redirect(200, `/categoria/${req.params.categoria}`, {layout: 'index', inventario:filtrado, nombre: req.user.nombre })
        }, 
    getProductsByCategory: async (req, res) => {
            const filtrado = await Productos.buscarPorCategoria(req.params.categoria)
            filtrado.map((item)=>{
                item._id = item._id.toString()
            })
            res.status(200).json(filtrado)
        },
    putProductsById: async (req, res) => {
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
        },
    deleteProductById: async (req, res) => {
        if(administrador) {
                await Productos.eliminarProducto(req.params.id)
                res.send('Producto eliminado').status(200)
            }
            else{
                res.send({ error: -1, descripcion: "ruta '/:id', método DELETE no autorizada"}).status(401)
            }
        }
}