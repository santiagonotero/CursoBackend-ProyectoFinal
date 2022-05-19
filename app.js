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
const yargs = require('yargs')
const cluster = require('cluster')
const numCPUs = require ('os').cpus().length
const {engine} = require ('express-handlebars')
const homeRouter= require('./routes/home')
const cartRouter = require('./routes/carrito')
const productRouter = require('./routes/productos')
const initializePassport=require('./middlewares/passport')
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

function iniciarMain(){
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
          expires: 60*30,
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
        })
      })

      server.listen(PORT, ()=>{
          console.log(`Realizando conexión con el puerto ${PORT}`)
      })

  })        

  .catch((err)=>{
          console.log("error en Mongo", err)
  })

}


const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./DBconfig/Mongo")

const PORT= process.env.PORT || 8080

const args = yargs.default({ PORT: 8080, mode:'fork'}).argv

if(args.mode ==='cluster'){   //Si el modo es Cluster...
  
  console.log('modo CLUSTER')
  if(cluster.isMaster) {    // Si el proceso es padre...
    for(let i=0; i<=numCPUs; i++){
      
      console.log ('Creando nuevo Fork')
      cluster.fork()
      
    }
    
    cluster.on('exit', (worker, code, signal)=>{
      console.log(`worker ${worker.process.id} murió`)
    })
    
    console.log (`Proceso primario ${process.pid}`)
  }   //if(mode == 'cluster')

  else{           // Si el proceso es hijo en modo cluster...
      iniciarMain()
  }  
}

else{
  console.log('Modo FORK')
  iniciarMain()
}

