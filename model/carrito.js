const mongoose = require('mongoose')

class Carrito {

    constructor() {

        const schema = new mongoose.Schema({
            id: Number, 
            email: String,
            direccion: String,
            timestamp: {type: Number, default:Date.now()},
            productos: {type: Object, default:{}}
        })
        this.data=[]
        this.model = mongoose.model('carritos', schema)
    }


    async leerCarrito(email){
        const carrito = await this.model.find({email})
        this.data = carrito
        return carrito
    }

    async crearCarrito(email){
        const nuevoCarrito = await this.model.create({productos:[], timestamp: Date.now(), email})
        return nuevoCarrito
    }

    async agregarProducto(idProducto, email){
        const carritoBuscado = await this.model.find({email},{}).lean()
        let listaArticulos = carritoBuscado[0].productos
        const articulo = listaArticulos.findIndex(element =>element.item === idProducto)
        if(articulo !== -1){
            carritoBuscado[0].productos[articulo].cantidad++
            await this.model.findOneAndUpdate({email}, {productos: carritoBuscado[0].productos})
            return true
        }
        else{
            carritoBuscado[0].productos.push({item: idProducto, cantidad:1})
            await this.model.findOneAndUpdate({email}, {productos: carritoBuscado[0].productos})
            return false
        }
    }

    async eliminarCarrito(idCarrito){
        await this.model.deleteOne({_id:idCarrito})
    }

    async vaciarCarrito(email){
        await this.model.findOneAndUpdate({email}, {productos: []})

    }

    async eliminarProducto(email, idProducto){

        let listaProd = await this.model.find({email},{productos}).lean()
        for(let prod of listaProd){
            if (prod.id === idProducto){
                prod.delete()
            }
        }
        await this.model.updateOne({_id:idCarrito},{productos: listaProd})    
    }

}

module.exports = new Carrito() 