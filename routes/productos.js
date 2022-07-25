const {Router} = require ('express')
const routerProductos = Router()
const productsMethod = require('../model/productos.methods')

routerProductos.get('/', productsMethod.getProducts)
routerProductos.get('/:id', productsMethod.getProductsById)
routerProductos.post('/categoria/:categoria', productsMethod.postProductsByCategory)
routerProductos.get('/categoria/:categoria', productsMethod.getProductsByCategory)
routerProductos.put('/:id', productsMethod.putProductsById)
routerProductos.delete('/:id', productsMethod.deleteProductById)

module.exports = routerProductos