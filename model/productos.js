const path = require ('path')
const mongoose = require('mongoose')
//const fs = require ('fs/promises')

class Producto {

    constructor(){
        const schema = new mongoose.Schema({
            id: Number,
            timestamp: {type: Number, default: Date.now()},
            nombre: String,
            descripcion: String,
            codigo: String,
            foto: String,
            precio: Number,
            stock: {type: Number, default: 0}
        })

        this.data=[]
        this.model=mongoose.model('Producto', schema)
        
    }

    async agregarProducto(obj){

        const producto = await this.model.create(obj)
        return producto
    }

    async reemplazarProducto(id_prod, obj){

        const rep = await this.model.updateOne({id:id_prod},obj)
        return rep.modifiedCount
    }

    async eliminarProducto(id_prod){

        await this.model.deleteOne({id:id_prod})

    }

    async leerProducto(codigoProducto){//params){    

        //this.data = await this.model.find({id:params.id}).lean()

        return await this.model.find({codigo: codigoProducto}).lean()
        
    }

    async readData(){

        this.data = await this.model.find({}).lean()
    }

}

module.exports = new Producto() 