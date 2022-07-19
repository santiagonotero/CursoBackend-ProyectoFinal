const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const multer = require('multer')
const passport=require('passport')
const logger = require("../Logs/winston")
const homeRouter = Router()
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Carrito = require('../model/carrito')
const Mensajes = require('../model/mensajes')
const controller = require('../model/routes.methods')

homeRouter.get('/api/currentuser', (req, res)=>{

    const userProfile ={
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        telefono: req.user.telefono
    }

    res.send(userProfile).status(200)
})

homeRouter.get('/', auth, async (req, res) => {
    await Productos.readData()
    await Mensajes.cargarMensajes()
    const inventario = Productos.data
    if(Productos.data.length){

        res.render('index', { layout: 'index', inventario: inventario, nombre: `${Usuario.data.nombre} ${Usuario.data.apellido}`, email: Usuario.data.email})
    }
})

homeRouter.get('/login', (req, res) => {
    res.render('login')
})

homeRouter.post('/login', passport.authenticate('login', {
    successRedirect: '/', 
    failureRedirect: '/login',
    failureFlash:true
}))

homeRouter.post('/logout' , (req, res)=>{

    res.render('logout')
})

homeRouter.get('/logout', auth, (req, res) => {

    req.logOut()
    res.render('logout', {layout: 'logout', nombre: Usuario.data.nombre})
})

homeRouter.get('/cart', auth, async (req, res) => {

    try {
        const carrito = await Carrito.leerCarrito(req.user.idCarrito)
        let listaArticulos = {...carrito}[0].productos

        let arrayArticulos = []
        let precioTotal = 0

        for(let i=0; i<listaArticulos.length; i++) {
            const detalleProducto = {...await Productos.leerProducto(listaArticulos[i])}
            arrayArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio, codigo: listaArticulos[i]})
            precioTotal +=JSON.parse(detalleProducto[0].precio)
        } 

        res.render('cart', { layout:'cart', carrito: arrayArticulos, precioTotal: precioTotal})
    }
    catch(err){
        logger.error(err)
    }

    res.status(200)
})


homeRouter.get('/cartok', auth, (req, res)=>{

    res.render('cartok')
})


homeRouter.get('/signup', (req, res) => {

    res.render('signup')
})

homeRouter.post('/signup', 
//         (req, res, next) => {
//         if(req.body.password1 === req.body.password2){
//             console.log('Contraseñas coinciden')
//             console.log(req.body)
//             next()
//         }
//         else{
//             console.log('Contraseñas no son iguales')
//             next()
//         }
//     },
    passport.authenticate('signup', {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: false
    }), (req, res)=>{
        res.redirect('/')
    }
)

module.exports = homeRouter;
