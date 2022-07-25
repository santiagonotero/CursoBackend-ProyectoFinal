const logger = require("../Logs/winston")
const CPUS = require("os").cpus().length
const passport=require('passport')
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Mensajes = require('../model/mensajes')

module.exports = {
    getCurrentUser: (req, res)=>{
            const userProfile ={
                nombre: req.user.nombre,
                apellido: req.user.apellido,
                email: req.user.email,
                telefono: req.user.telefono
            }
            res.send(JSON.stringify(userProfile)).status(200)
        },
    getHome: async (req, res) => {
            await Productos.readData()
            const inventario = Productos.data
            inventario.map((item)=>{
                item._id = item._id.toString()
            })
            if(Productos.data.length){
                res.render('index', { layout: 'index', nombre: `${Usuario.data.nombre} ${Usuario.data.apellido}`, email: Usuario.data.email})
            }
        },
    getSystemInfo: (req,res)=>{
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
        },
    getLogin: (req, res) => {
            res.render('login')
        },
    postLogin: passport.authenticate('login', {
            successRedirect: '/', 
            failureRedirect: '/login',
            failureFlash:true
            }),
    postLogout: (req, res)=>{
            res.render('logout')
        },
    getLogout: (req, res) => {
            req.logOut()
            res.render('logout', {layout: 'logout', nombre: Usuario.data.nombre})
        },
    getSignup: (req, res) => {
            res.render('signup')
        },
    postSignup: ()=>{
            passport.authenticate('signup', {
            successRedirect: "/",
            failureRedirect: "/signup",
            failureFlash: false
            }), (req, res)=>{
                res.redirect('/')
            }
        },
    getChat: async (req, res)=>{
            await Mensajes.cargarMensajes()
            const messages = Mensajes.data
            res.render('chat', { layout:'chat', userEmail: req.user.email})
        },
    getChatEmail: async (req, res)=>{
            await Mensajes.cargarMensajes()
            const messages = Mensajes.data.filter(msg =>{if((msg.email === req.params.email) || (msg.tipo ==='sistema')){
                    return msg 
                }
            })
            res.render('emailchat', { layout:'emailchat', messages})
        }
}