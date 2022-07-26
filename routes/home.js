const {Router} = require ('express')
const {auth} = require ('../middlewares/auth')
const homeRouter = Router()
const homeMethods = require('../model/home.methods')

homeRouter.get('/api/currentuser', homeMethods.getCurrentUser)
homeRouter.get('/', auth, homeMethods.getHome)
homeRouter.get('/login', homeMethods.getLogin)
homeRouter.post('/login', homeMethods.postLogin)
homeRouter.post('/logout' , homeMethods.postLogout)
homeRouter.get('/logout', auth, homeMethods.getLogout)
homeRouter.get('/chat', auth, homeMethods.getChat)
homeRouter.post('/chat/:email', auth, homeMethods.postChatEmail)
homeRouter.get('/chat/:email', auth, homeMethods.getChatEmail)
homeRouter.get('/signup', homeMethods.getSignup)
homeRouter.post('/signup', homeMethods.postSignup)
homeRouter.get('/system', homeMethods.getSystemInfo)


module.exports = homeRouter;
