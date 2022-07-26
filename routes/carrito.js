const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const routerCarrito = Router()
const cartMethods = require('../model/carrito.methods')

routerCarrito.get('/', auth, cartMethods.getCart)
routerCarrito.post('/', cartMethods.postCart)
routerCarrito.get('/:id/productos', cartMethods.listProducts)
routerCarrito.delete('/:id', cartMethods.deleteCart)
routerCarrito.post('/:id/productos', cartMethods.addProduct)
routerCarrito.delete('/:id/productos/:id_prod', cartMethods.deleteProduct)
routerCarrito.post('/finalizarcompra', cartMethods.endSelling)

module.exports = routerCarrito
