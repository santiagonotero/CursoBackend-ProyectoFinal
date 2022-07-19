const path = require ('path')
const mongoose = require('mongoose')

class Mensajes {

    constructor() {

        const schema = new mongoose.Schema({
            id: Number, 
            email: String,
            tipo: String,
            fecha: String,
            hora: String,
            mensaje: String
        })
        this.data=[]
        this.model = mongoose.model('mensajes', schema)
    }

    async agregarMensaje(obj){

        const nuevoMsg = await this.model.create(obj)
        return nuevoMsg
    }

    async cargarMensajes(){

        this.data = await this.model.find({}).lean()
        return true
    }

}

module.exports = new Mensajes()