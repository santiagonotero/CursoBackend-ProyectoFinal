const express = require('express');
const app = express();
const path=require('path');
let server = require('http').Server(app);
let io = require('socket.io')(server);
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session= require('express-session');
const flash = require('express-flash');
const yargs = require('yargs');
const cluster = require('cluster');
const logger = require("./Logs/winston");
const numCPUs = require ('os').cpus().length;
const {engine} = require ('express-handlebars');
const Mensajes = require('./model/mensajes');
const homeRouter= require('./routes/home');
const cartRouter = require('./routes/carrito');
const productRouter = require('./routes/productos');
const initializePassport=require('./middlewares/passport');
//const {port} = require('./config')
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

const PORT = process.envPORT || 8080
let messagePool={}  // Mensajes del canal de chat

function iniciarMain(){
  // Conexión a MongoDB

  mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
      logger.info("Conectado con base de datos MongoDB")

      initializePassport(passport)

      app.use("/static/", express.static(path.join(__dirname, "public")))

      app.use(express.json())
      app.use(express.urlencoded({ extended: true}))

      app.use(flash())
      app.use(cookieParser("Esto es un secreto"))
      app.use(session({
        secret:'secret',
        resave: true,
        saveUninitialized:true, 

        store:new MongoStore({
          mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
          expires: 1000*60*30, // Tiempo de expiración: 30 minutos
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
      app.use('/api/carrito', cartRouter)
      app.use('/api/productos', productRouter)

      app.set('view engine', 'hbs')
    
      app.engine('hbs',engine({
        layoutsDir: path.join(__dirname,'/views'),
        extname: 'hbs',
        defaultLayout:''
      }))

      io.on("connection", (socket)=>{
        
        logger.info("Iniciando sockets")
        Mensajes.cargarMensajes().then(()=>{
          socket.emit("loadMessages", {...Mensajes.data})
        })

        socket.on('newMessage', (data)=>{  // Mensaje que indica un nuevo mensaje de chat recibido
          console.log('Nuevo mensaje: ', data)
          Mensajes.agregarMensaje(data).then(()=>{  // Almacenar mensaje en la base de datos
            Mensajes.data.push(data)
          })
          io.sockets.emit("loadMessages", {...Mensajes.data})
        })
      })

      server.listen(PORT, ()=>{
          logger.info(`Realizando conexión con el puerto ${PORT}`)
      })
  })        

  .catch((err)=>{
          logger.error("error en Mongoooo", err)
  })

}


const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./DBconfig/Mongo")

const args = yargs.default({ PORT: 8080, mode:'fork'}).argv

if(args.mode ==='cluster'){   //Si el modo es Cluster...
  
  logger.info('modo CLUSTER')
  if(cluster.isMaster) {    // Si el proceso es padre...
    for(let i=0; i<=numCPUs; i++){
      
      logger.info('Creando nuevo Fork')
      cluster.fork()
      
    }
    
    cluster.on('exit', (worker, code, signal)=>{
      logger.info(`worker ${worker.process.id} murió`)
    })
    
    logger.info(`Proceso primario ${process.pid}`)
  }   //if(mode == 'cluster')

  else{           // Si el proceso es hijo en modo cluster...
      iniciarMain()
  }  
}

else{
  logger.info('Servicio iniciado en modo FORK')
  iniciarMain()
}





