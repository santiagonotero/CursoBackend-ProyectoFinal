const session= require('express-session')
const bCrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({username}, (err, user) => {
            if(err){
                return done(err)
            }

            if(!user){
                console.log("Usuario no encontrado")
                return done(null, false)
            }

            if(!isValidPassword(user, password)){
                console.log('Contraseña inválida')
                return done(null, false)
            }

            return done(null, user)
        })
    })
)

passport.use('signup', new LocalStrategy({
    passReqToCallback:true
},
(req, username, password, done) => {
    user.findOne({'username': username}, function(err, user){

        if(err) {
            console.log('Error al registrarse' + err)
            return done(err)
        }

        if (user){
            console.log('El usuario ya existe')
            return done(null, false)
        }

        const newUser={
            nombre:req.body.username, 
            password: createHash(req.body.password),
            email: req.body.email,
            direccion:req.body.direccion,
            edad: req.body.edad,
            avatar: req.body.avatar
        }

        User.create(newUser, (err, userWithId) =>{
            if(err){
                console.log('Error al guardar usuario' + err)
                return done(err)
            }
            console.log(user)
            console.log('Registro de usuario exitoso')
            return done(null, userWithId)
        })
    })
    })
)

passport.serializeUser((user,done)=>{
    done(null, user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id, done)
})

function createHash(password){
    return bCrypt.hashSync(
        password,
        bCrypt.genSaltSync(10),
        null
    )
}