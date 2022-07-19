const Usuario = require('../model/usuarios')
const Carrito = require('../model/carrito')

module.exports ={
    signup: async(req, res)=>{
                console.log('/signup')
                console.log('req.file', req.file)
                const userData = {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    password: req.body.password,
                }
                await Usuario.agregarUsuario(userData)
                res.redirect('/')
        }
}