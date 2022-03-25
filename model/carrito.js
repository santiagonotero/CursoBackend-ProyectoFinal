const path = require ('path')
const mongoose = require('mongoose')
const fs = require ('fs/promises')
const Firebase = require('../firebase')

class Carrito {

    constructor() {

        const schema = new mongoose.Schema({
            id: Number, 
            timestamp: {type: Number, default:Date.now()},
            productos: []
        })
        this.data=[]
        this.model = mongoose.model('carritos', schema)
    }


    async leerCarrito(id_carrito){
        const query = Firebase.db.collection('carritos')
        const FbData = await query.get()
        const docs = FbData.docs
        for(let d of docs){
            console.log(d.data())
        }
        const carrito = await this.model.find({id:id_carrito},{})
        this.data = carrito
    }

    async crearCarrito(){
        const query = Firebase.db.collection('carritos')
        const ultimoIdFb = await (await query.get()).size + 1
        console.log(ultimoIdFb)
        const nuevoDoc = query.doc(`${ultimoIdFb}`) 
        await nuevoDoc.create([{id: ultimoIdFb}, {timestamp: Date.now()}, {productos: []}])

        const ultimoId = await this.model.countDocuments()+1
        await this.model.create([{id: ultimoId}])
        return ultimoId
    }

    async agregarProducto(idCarrito, Producto){
        const query = Firebase.db.collection('carritos')
        const carritoBuscado = await this.model.findOneAndUpdate({id:idCarrito}, {$push: {productos: Producto}})
    }

    async eliminarCarrito(idCarrito){
        const query = Firebase.db.collection('carritos')
        await this.model.deleteOne({id:idCarrito})
    }

    async eliminarProducto(idCarrito, idProducto){
        const query = Firebase.db.collection('carritos')

        let listaProd = await this.model.find({id:idCarrito},{productos})
        for(let prod of listaProd){
            if (prod.id === idProducto){
                prod.delete()
            }
        }
        await this.model.updateOne({id:idCarrito},{productos: listaProd})    
    }

    // constructor(){
    //     this.path = path.join(__dirname, '../database/carrito.json')
    //     this.data= []    // Data contiene todos los carritos que se crean
    // }

    // async crearCarrito(carrito){
    //     await this.readData()
    //     carrito.timestamp = Date.now()
    //     if(this.data.length === 0){
    //         carrito.id = 1
    //     }
    //     else{
    //         carrito.id = this.data[this.data.length -1].id + 1
    //     }
    //     this.data.push(carrito)
    //     await this.writeData()
    // }

    // async eliminarCarrito(id_carrito){
    //     await this.readData()
    //     const carrito = this.data.filter((c)=>JSON.parse(c.id) !== JSON.parse(id_carrito))
    //     this.data = carrito
    //     await this.writeData()
    // }

    // async agregarProducto(id, producto){
    //     await this.readData()
    //     const carrito = this.getCarrito(id)
    //     carrito.productos.push(producto)
    //     await this.writeData()
    // }

    // async borrarProducto( id_carrito, id_prod){
    //     await this.readData()
    //     const filtrado={}
    //     const carrito = this.getCarrito(id_carrito)
    //     filtrado.productos = carrito.productos.filter(p =>p.id != id_prod)
    //     filtrado.timestamp = carrito.timestamp
    //     filtrado.id = id_carrito
    //     this.data[id_carrito-1] = filtrado
    //     await this.writeData()
    // }

    // async readData(){
    //     this.data = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    // }

    // async writeData(){
    //     await fs.writeFile(this.path, JSON.stringify(this.data, null, 2))
    // }

    // getCarrito(id){
    //     const carrito = this.data.find(c=>JSON.parse(c.id) === JSON.parse(id))
    //     if(!carrito){
    //         throw new Exception('Carrito not found')
    //     }
    //     return carrito
    // }
    
}

module.exports = new Carrito() 