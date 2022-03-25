const path = require ('path')
const mongoose = require('mongoose')
const fs = require ('fs/promises')
const Firebase = require('../firebase')

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
        const query = Firebase.db.collection('productos')
        const ultimoId = await (await query.get()).size + 1
        console.log(ultimoId)
        const nuevoDoc = query.doc(`${ultimoId}`) 
        await nuevoDoc.create(obj)
        const producto = await this.model.create(obj)
        return producto
    }

    async reemplazarProducto(id_prod, obj){
        const query = Firebase.db.collection('productos')
        const doc = query.doc(`${id_prod}`)
        await doc.update(obj)
        const rep = await this.model.updateOne({id:id_prod},obj)
        return rep.modifiedCount
    }

    async eliminarProducto(id_prod){
        const query = Firebase.db.collection('productos')
        const doc = query.doc(`${id_prod}`)
        await doc.delete()
        await this.model.deleteOne({id:id_prod})

    }

    async leerProducto(params){    
        const query = Firebase.db.collection('productos')
        const FbData = await query.get(params.id) 
        const doc = FbData.docs  
        console.log(doc[0].data())
        this.data = await this.model.find({id:params.id})
        
    }

    async readData(){
        const query = Firebase.db.collection('productos')
        const FbData = await query.get()
        const docs = FbData.docs
        for(let d of docs){
            console.log(d.data())
        }

        this.data = await this.model.find({})
    }

    // constructor(){
    //     this.path = path.join(__dirname, '../database/productos.json')
    //     this.data= []    // Data contiene todos los productos que se agregan o eliminan
    // }
    // async reemplazarProducto(id_prod, producto){
    //     await this.readData()
    //     const articulo = this.data.find(p => JSON.parse(p.id) === id_prod)
    //     if(!articulo){
    //         throw new error('Error: Producto no encontrado')
    //     }
    //     else{
    //         let modificado = this.data.map((dato) => {
    //             if(JSON.parse(dato.id)=== id_prod) {
    //                 dato = producto
    //                 dato.timestamp= Date.now()
    //             }
    //             return dato
    //         })
    //         this.data = modificado
    //         await this.writeData()
    //     }  
    // }

    // async eliminarProducto(id_prod){
    //     await this.readData()
    //     const filtrado = this.data.filter(d => JSON.parse(d.id) != JSON.parse(id_prod))
    //     this.data = filtrado
    //     await this.writeData()
    // }

    // async agregarProducto(producto){
    //     await this.readData()
    //     this.data.push(producto)
    //     await this.writeData()
    // }

    // async borrarProducto( id_prod){
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
}

module.exports = new Producto() 