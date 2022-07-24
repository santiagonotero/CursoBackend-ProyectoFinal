const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const passport=require('passport')
const logger = require("../Logs/winston")
const homeRouter = Router()
const CPUS = require("os").cpus().length
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Carrito = require('../model/carrito')
const Mensajes = require('../model/mensajes')

homeRouter.get('/api/currentuser', (req, res)=>{

    const userProfile ={
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        telefono: req.user.telefono
    }

    res.send(JSON.stringify(userProfile)).status(200)
})

homeRouter.get('/', auth, async (req, res) => {
    await Productos.readData()
    const inventario = Productos.data
    inventario.map((item)=>{
        item._id = item._id.toString()
    })
    if(Productos.data.length){
        res.render('index', { layout: 'index', nombre: `${Usuario.data.nombre} ${Usuario.data.apellido}`, email: Usuario.data.email})
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

homeRouter.get('/carrito', auth, async (req, res) => {

    try {
        const carrito = await Carrito.leerCarrito(req.user.email)
        let listaArticulos = {...carrito}[0].productos     
        let pedidoArticulos = []
        let precioTotal = 0
        for(let i=0; i<listaArticulos.length; i++) {
            const detalleProducto = {...await Productos.leerProducto(listaArticulos[i].item)}
            pedidoArticulos.push({nombre: detalleProducto[0].nombre, precio: detalleProducto[0].precio * listaArticulos[i].cantidad, cantidad: listaArticulos[i].cantidad, codigo: detalleProducto[0].codigo})
            precioTotal +=JSON.parse(pedidoArticulos[i].precio)
        } 

        res.render('carrito', { layout:'carrito', carrito: pedidoArticulos, precioTotal: precioTotal})
    }
    catch(err){
        logger.error(err)
    }

    res.status(200)
})

homeRouter.get('/chat', auth, async (req, res)=>{
    await Mensajes.cargarMensajes()
    const messages = Mensajes.data
    res.render('chat', { layout:'chat', userEmail: req.user.email})
})

homeRouter.get('/chat/:email', auth, async (req, res)=>{
    console.log(req.params.email)
    await Mensajes.cargarMensajes()
    const messages = Mensajes.data.filter(msg =>{if((msg.email === req.params.email) || (msg.tipo ==='sistema')){
        return msg 
    }
    })
    res.render('emailchat', { layout:'emailchat', messages})
})


homeRouter.get('/signup', (req, res) => {

    res.render('signup')
})

homeRouter.post('/signup', 
    passport.authenticate('signup', {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: false
    }), (req, res)=>{
        res.redirect('/')
    }
)

homeRouter.get('/system', (req,res)=>{
    res.render('system', {
        layout: 'system', 
        rss:process.memoryUsage().rss.toString(),
        argv: process.argv,
        cwd: process.cwd(),
        nodeVersion: process.env.npm_config_node_version,
        execPath: process.execPath,
        versionSO: process.env.OS,
        pid: process.pid.toString(),
        cpus: CPUS
    })
})


module.exports = homeRouter;
