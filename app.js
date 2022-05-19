const express = require('express')
const app = express()
const path=require('path')
let server = require('http').Server(app)
let io = require('socket.io')(server)
const mongoose = require('mongoose')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const session= require('express-session')
const flash = require('express-flash')
const {engine} = require ('express-handlebars')
const homeRouter= require('./routes/home')
//const uploadRouter = require ('./routes/upload')
const cartRouter = require('./routes/carrito')
const productRouter = require('./routes/productos')
const initializePassport=require('./middlewares/passport')
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./DBconfig/Mongo")

const PORT= process.env.PORT || 8080

// Conexión a MongoDB

mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
    console.log("Conectado con base de datos MongoDB")

    initializePassport(passport)

    app.use("/static/", express.static(path.join(__dirname, "public")))

    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))

    const storage = multer.diskStorage(
      { destination: function (req, file, cb) {cb (null, 'Avatares')},
        filename:(req, file,cb)=>{
        const extension = file.mimetype.split('/')[1]
        cb(null, `Avatar - ${req.body.email} - ${Date.now()}.${extension}`)
        }
      }
    )

    app.use(multer({
      storage,
      dest: '/Avatares'
    }).single('avatar'))

    app.use(flash())
    app.use(cookieParser("Esto es un secreto"))
    app.use(session({
      secret:'secret',
      resave: true,
      saveUninitialized:true, 

      store:new MongoStore({
        mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
        expires: 60,
        createdAt: new Date(),
        autoRemove: 'native',
        autoRemoveInterval: 1,
        ttl: 60, 
        autoRemove: true,
        delete: true
      })
    }))


    app.use(passport.initialize())
    app.use(passport.session())

    app.use('/', homeRouter)
    //app.use('/upload', uploadRouter)
    app.use('/api/carrito', cartRouter)
    app.use('/api/productos', productRouter)

    app.set('view engine', 'hbs')
  
    app.engine('hbs',engine({
      layoutsDir: path.join(__dirname,'/views'),
      extname: 'hbs',
      defaultLayout:''
    }))

    io.on("connection", async function (socket) {
      socket.on('newUser', (userData)=>{
        console.log('app.js-> userData %o', userData)
      })
    })

    server.listen(PORT, ()=>{
        console.log(`Realizando conexión con el puerto ${PORT}`)
    })

})        

.catch((err)=>{
        console.log("error en Mongo", err)
})

