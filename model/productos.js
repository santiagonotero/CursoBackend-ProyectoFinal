const mongoose = require('mongoose')

class Producto {

    constructor(){
        const schema = new mongoose.Schema({
            id: Number,
            timestamp: {type: Number, default: Date.now()},
            nombre: String,
            descripcion: String,
            categoria: String,
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
        this.data.push(producto)
        return producto
    }

    async buscarPorCategoria(categoria){

        let productos
        if(categoria !== 'todas'){
            productos = await this.model.find({categoria}).lean()
        }
        else{
            productos = await this.model.find({}).lean()
        }
        this.data = productos
        return productos
    }

    async reemplazarProducto(id_prod, obj){

        const rep = await this.model.updateOne({id:id_prod},obj)
        return rep.modifiedCount
    }

    async eliminarProducto(id_prod){

        await this.model.deleteOne({id:id_prod})

    }

    async leerProducto(idProducto){ 

        this.data = await this.model.find({_id:idProducto}).lean()
        return this.data
    }

    async readData(){

        this.data = await this.model.find({}).lean()
        return this.data
    }

}

module.exports = new Producto() 