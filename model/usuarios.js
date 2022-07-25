const path = require ('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

class Usuario {

    constructor(){
        const schema = new mongoose.Schema({
            id: Number,
            email: String,
            nombre: String,
            apellido: String,
            password: String,
            direccion: String,
            edad: Number,
            telefono: Number,
            avatar: String,
            idCarrito: String
        })

        this.data=[]
        this.model=mongoose.model('Usuarios', schema)
        
    }

  async save(obj) {
    obj.password = await bcrypt.hash(obj.password, 10)
    return await this.model.create(obj)
  }

    async agregarUsuario(obj){

        obj.password = await bcrypt.hash(obj.password, 10)
        return await this.model.create(obj)
    }

    existsByEmail(email) {
        return this.model.exists({ email })
    }

    async getById(id) {
        return await this.model.findById(id)
    }

    async getByEmail(email) {
        const user = await this.model.findOne({ email })

        return {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            apellido: user.apellido,
            direccion: user.direccion,
            edad: user.edad,
            password: user.password,
            telefono: user.telefono,
            avatar: user.avatar
        }
    }

    async isPasswordValid(email, pwd) {
        const user = await this.model.findOne({ email })
        return await bcrypt.compare(pwd, user.password)
    }

    async eliminarUsuario(id){
        await this.model.deleteOne(id)
    }

    async leerUsuario(params){    
        this.data = await this.model.find({id:params.id})
    }

    async readData(){
        this.data = await this.model.find({})
    }

    findOrCreateByEmail(email, user, done) {
        this.model.findOneAndUpdate({ email }, user, { upsert: true, new: true }, (err, createdUser) => {
          done(err, {
            id: createdUser._id.toString(),
            nombre: createdUser.nombre,
            email: createdUser.email
          })
        })
      }
}

module.exports = new Usuario() 