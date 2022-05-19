const path = require ('path')
const mongoose = require('mongoose')
const fs = require ('fs/promises')


class Carrito {

    constructor() {

        const schema = new mongoose.Schema({
            id: Number, 
            timestamp: {type: Number, default:Date.now()},
            productos: {type: Object, default:{}}
        })
        this.data=[]
        this.model = mongoose.model('carritos', schema)
    }


    async leerCarrito(id_carrito){

        const carrito = await this.model.find({_id:mongoose.Types.ObjectId(id_carrito)},{}).lean()
        this.data = carrito
        return carrito
    }

    async crearCarrito(){

        const ultimoId = await this.model.countDocuments()+1
        const nuevoCarrito = await this.model.create({productos:[], timestamp: Date.now()})
        return nuevoCarrito
    }

    async agregarProducto(idProducto, idCarrito){  //, Producto){

        const carritoBuscado = await this.model.find({_id:idCarrito},{}).lean()

        carritoBuscado.filter(async (articulos)=>{
            let listaCarrito = articulos.productos

            if (!articulos.productos.cantidad){
                await this.model.findByIdAndUpdate({_id: idCarrito}, {$push: {productos: idProducto, cantidad: 1}})
            }
            else{
                const nuevaCantidad = articulos.productos.cantidad + 1
                await this.model.findByIdAndUpdate({_id: idCarrito}, {$push: {productos: idProducto, cantidad: nuevaCantidad}})

            }
        })
    }

    async eliminarCarrito(idCarrito){
        await this.model.deleteOne({_id:idCarrito})
    }

    async vaciarCarrito(idCarrito){
        const carritoBuscado = await this.model.find({_id:mongoose.Types.ObjectId(idCarrito)},{}).lean()
        const totalItems = {...carritoBuscado}
        await this.model.findOneAndUpdate({_id:mongoose.Types.ObjectId(idCarrito)},{productos: []}) 

    }

    async eliminarProducto(idCarrito, idProducto){

        let listaProd = await this.model.find({_id:idCarrito},{productos}).lean()
        for(let prod of listaProd){
            if (prod.id === idProducto){
                prod.delete()
            }
        }
        await this.model.updateOne({_id:idCarrito},{productos: listaProd})    
    }

}

module.exports = new Carrito() 