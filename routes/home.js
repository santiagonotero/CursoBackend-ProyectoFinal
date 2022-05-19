const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const passport=require('passport')
const homeRouter = Router()
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Carrito = require('../model/carrito')

homeRouter.get('/api/currentuser', (req, res)=>{

    const userProfile ={
        nombre: req.user.nombre,
        idCarrito: req.user.idCarrito,
        email: req.user.email,
        direccion: req.user.direccion,
        telefono: req.user.telefono,
        avatar: req.user.avatar,
        edad: req.user.edad,
    }

    res.send(userProfile).status(200)
})

homeRouter.get('/', auth, async (req, res) => {
    await Productos.readData()
    const inventario = Productos.data
    if(Productos.data.length){

        res.render('index', { layout: 'index', inventario: inventario })
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
    res.render('logout')
})

homeRouter.get('/cart', async (req, res) => {

    console.log(req.user)

    const carrito = await Carrito.leerCarrito(req.user.idCarrito)

    console.log('carrito', carrito)

    res.render('cart', { layout:'cart', carrito: carrito})
})

homeRouter.get('/signup', (req, res) => {
    res.render('signup')
})

homeRouter.post('/signup', passport.authenticate('signup', {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
    }),
    (req, res) => {

     res.sendStatus(200)
})

module.exports = homeRouter
