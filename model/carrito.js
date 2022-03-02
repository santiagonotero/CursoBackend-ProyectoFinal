const path = require ('path')
const fs = require ('fs/promises')

class Carrito {
    constructor(){
        this.path = path.join(__dirname, '../database/carrito.json')
        this.data= []    // Data contiene todos los carritos que se crean
    }

    async crearCarrito(carrito){
        await this.readData()
        carrito.timestamp = Date.now()
        if(this.data.length === 0){
            carrito.id = 1
        }
        else{
            carrito.id = this.data[this.data.length -1].id + 1
        }
        this.data.push(carrito)
        await this.writeData()
    }

    async eliminarCarrito(id_carrito){
        await this.readData()
        const carrito = this.data.filter((c)=>JSON.parse(c.id) !== JSON.parse(id_carrito))
        this.data = carrito
        await this.writeData()
    }

    async agregarProducto(id, producto){
        await this.readData()
        const carrito = this.getCarrito(id)
        carrito.productos.push(producto)
        await this.writeData()
    }

    async borrarProducto( id_carrito, id_prod){
        await this.readData()
        const filtrado={}
        const carrito = this.getCarrito(id_carrito)
        filtrado.productos = carrito.productos.filter(p =>p.id != id_prod)
        filtrado.timestamp = carrito.timestamp
        filtrado.id = id_carrito
        this.data[id_carrito-1] = filtrado
        await this.writeData()
    }

    async readData(){
        this.data = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    }

    async writeData(){
        await fs.writeFile(this.path, JSON.stringify(this.data, null, 2))
    }

    getCarrito(id){
        const carrito = this.data.find(c=>JSON.parse(c.id) === JSON.parse(id))
        if(!carrito){
            throw new Exception('Carrito not found')
        }
        return carrito
    }
    
}

module.exports = new Carrito() 