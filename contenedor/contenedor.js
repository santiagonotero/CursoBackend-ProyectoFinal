

const Contenedor = class {

    constructor(nombreArchivo){
        this.nombreArchivo=nombreArchivo
    }

    async save(objeto){ ///Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.

        const fs=require('fs')
        let contenido
        let datosParseados
        let ultimoID=1

        try{
            contenido = await fs.promises.readFile(this.nombreArchivo,'utf8')
            datosParseados=JSON.parse(contenido)
        }
        catch(error){
            console.log('No se pudo abrir el archivo. Código de error:' + error)
        }
        
        if(datosParseados.length>0){
            datosParseados.map(elemento=>{
                if(JSON.parse(elemento.id)>JSON.parse(ultimoID)){
                    ultimoID=elemento.id
                }
            })
            ultimoID++;
        }

        datosParseados.push({id:`${ultimoID}`,
                            ...objeto})

        try{
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(datosParseados),"utf8")
                console.log('El dato fue agregado al archivo')
        }

        catch(err){
            console.log('No se pudo agregar el dato al archivo')
        }
    }

    async getById(Numero){ //Recibe un id y devuelve el objeto con ese id, o null si no está.

        const fs=require('fs')
        let contenido
        let datosParseados
        let datoBuscado

        try{
            contenido = await fs.promises.readFile(this.nombreArchivo,'utf8')
            datosParseados=JSON.parse(contenido)
        }
        catch(error){
            console.log('No se pudo abrir el archivo. Código de error:' + error)
        }
        
        datosParseados.map(elemento=>{
            if(JSON.parse(elemento.id)===Numero){
                datoBuscado = elemento
            }
        })
        if(datoBuscado){
            console.log(datoBuscado)
        }
        else{
            console.log(null)
        }   
    }

    async getAll(){ //Devuelve un array con los objetos presentes en el archivo.

        const fs=require('fs')
        let contenido
        let datosParseados
        try{
            contenido = await fs.promises.readFile(this.nombreArchivo,'utf8')
            console.log(JSON.parse(contenido))
        }
        catch(error){
            console.log('No se pudo abrir el archivo. Código de error:' + error)
        }
    }

    async deleteById(Numero){ //Elimina del archivo el objeto con el id buscado.

            const fs=require('fs')
            let datosParseados
            let datosFiltrados

            try{
                const contenido = await fs.promises.readFile(this.nombreArchivo,'utf8')
                datosParseados=JSON.parse(contenido)
                datosFiltrados=datosParseados.filter(elemento=>{
                    if(JSON.parse(elemento.id)!==Numero){
                        return elemento
                    }
                })
            }
            catch(error){
                console.log('No se pudo abrir el archivo. Código de error:' + error)
            }
            
            try{
                await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(datosFiltrados),"utf8")
                    console.log('El dato fue borrado del archivo')
            }
    
            catch(err){
                console.log('No se pudo borrar dicho dato')
            }

    }

    async deleteAll(){  // Elimina todos los objetos presentes en el archivo.

        const fs=require('fs')
        try{
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([]),"utf8")
                console.log('Archivo borrado con éxito')
        }

        catch(err){
            console.log('No se pudo realizar la operación')
        }
    }
    
}


let nuevoArchivo= new Contenedor('Productos.json')

//nuevoArchivo.save({title:"pantalon", price:"1500", thumbnail: "___"})

//nuevoArchivo.getById(2)
///nuevoArchivo.getAll()
//nuevoArchivo.deleteById(3)
//nuevoArchivo.deleteAll()