const LocalStrategy = require('passport-local').Strategy
const Usuarios = require('../model/usuarios')
const Carrito = require('../model/carrito')
const MailSender = require('../notifications/email')

module.exports = (passport) =>{

    const authUser = async (email, password, done) => {
        try {
          // Verifica que exista el email
          if (!await Usuarios.existsByEmail(email)) {
            // regresar al usuario a la misma pantalla
            return done(null, false, { message: 'user does not exist!' })
          }
    
          // Verifica que los passwords coincidan
          if (!await Usuarios.isPasswordValid(email, password)) {
            return done(null, false, { message: 'incorrect password!' }) 
          }
    
          // obtener el usuario
          const user = await Usuarios.getByEmail(email)
          Usuarios.data = user
          done(null, user)
        } 
          catch (e) {
            done(e)
        }
      }

    const registerUser = async (req, email, password, done) => {
      const { nombre, apellido, telefono } = req.body
      const avatar = ''
      try {
        // Verificar que no exista el email
        if (await Usuarios.existsByEmail(email)) {
          // regresar al usuario a la misma pantalla
          console.log('Ya existe usuario')
          return done(null, false, { message: 'user already exists!' })
        }

        const user = await Usuarios.agregarUsuario({
          email,
          password,
          nombre,
          apellido,
          telefono,
          avatar
        })
        Usuarios.data = user
        // Se crea un carrito asociado a ese email
        await Carrito.crearCarrito(user.email)
        //Enviar email al usuario informando de su registro exitoso
        const mailInfo = await MailSender.newUserMail(nombre, apellido, telefono, email)
        done(null, {
          ...user,
          id: user._id
        })
      } 
        catch (e) {
          done(e)
        }
    }

    passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, authUser))
    passport.use('signup', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, registerUser))

    passport.serializeUser((user,done)=>done(null, user.id))
    passport.deserializeUser(async (id, done)=> {
        const user= await Usuarios.getById(id)
        done(null, {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        password: user.password, 
        telefono: user.telefono,
        avatar: user.avatar
                    }
            )
        }
    )  
}