const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const passport=require('passport')
const logger = require("../Logs/winston")
const homeRouter = Router()
const CPUS = require("os").cpus().length
const Productos = require ('../model/productos')
const Usuario = require('../model/usuarios')
const Mensajes = require('../model/mensajes')
const homeMethods = require('../model/home.methods')

homeRouter.get('/api/currentuser', homeMethods.getCurrentUser)
homeRouter.get('/', auth, homeMethods.getHome)
homeRouter.get('/login', homeMethods.getLogin)
homeRouter.post('/login', homeMethods.postLogin)
homeRouter.post('/logout' , homeMethods.postLogout)
homeRouter.get('/logout', auth, homeMethods.getLogout)
homeRouter.get('/chat', auth, homeMethods.getChat)
homeRouter.get('/chat/:email', auth, homeMethods.getChatEmail)
homeRouter.get('/signup', homeMethods.getSignup)
homeRouter.post('/signup', homeMethods.postSignup)
homeRouter.get('/system', homeMethods.getSystemInfo)


module.exports = homeRouter;
