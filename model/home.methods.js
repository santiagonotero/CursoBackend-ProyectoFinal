const logger = require("../Logs/winston")
const CPUS = require("os").cpus().length
const passport=require('passport')
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Mensajes = require('../model/mensajes')
const email = require("../notifications/email")

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
            let emailList=[]
            let isFound = false 
            if(messages){
               for(let i = 0 ; i < messages.length ; i++){
                    for(let j = 0 ; j < emailList.length ; j++){
                        if(emailList[j] === messages[i].email){
                            isFound = true
                        }
                    }
                    if(isFound === false){
                        emailList.push(messages[i].email)
                    }
               }
               isFound = false
            }
            res.render('chat', { layout:'chat', emailList, userEmail: req.user.email})
        },
    postChatEmail: (req, res) => {
        //res.redirect('/chat/:email')
        res.redirect(`/chat/${req.params.email}`)
    },
    getChatEmail: async (req, res)=>{
        console.log('getChatEmail')
        console.log(req.params.email)
            await Mensajes.cargarMensajes()
            const messages = Mensajes.data.filter(msg =>{if(msg.email === req.params.email){
                    return msg 
                }
            })
            console.log(messages)
            res.render('emailchat', { layout:'emailchat', messages})
        }
}