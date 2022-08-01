const plantillaProductos = `<div>
                                <ul>{{#each inventario}}
                                    <li><h2>{{this.nombre}}</h2></li>
                                    <li><p>{{this.descripcion}}</p></li>
                                    <li><p>Código: {{this.codigo}}</p></li>
                                    <li><img src={{this.foto}} /></li>
                                    <li> <p>Precio: ARS{{this.precio}}</p></li>

                                    <button onclick=addToCart("{{this._id}}")>Agregar al carrito</button>
                                {{/each}}</ul>
                            </div>
                            `

function pintarProductos(plantilla, datos){
    let copiaPlantilla = plantilla
    let compiler = Handlebars.compile(copiaPlantilla)
    let result = compiler({datos})
    let listado=document.getElementById("listadoProductos")
    listado.innerHTML = result
}

function cambiarCategoria(valor){
    fetch(`/productos/categoria/${valor}`, {headers: {
                                                'Content-Type': 'application/json',
                                                'Accept': 'application/json'}})
        .then(respuesta => respuesta.json())
        .then(inventario => {
            let plantilla= plantillaProductos
            let compiler = Handlebars.compile(plantilla)
            let result = compiler({inventario})
            let listado=document.getElementById("listadoProductos")
            listado.innerHTML = result
        })
    return true
}

socket.on('server:productList', (inventario)=>{
    let plantilla=plantillaProductos
    let compiler = Handlebars.compile(plantilla)
    let result = compiler(...inventario)
    let listado=document.getElementById("listadoProductos")
    listado.innerHTML = result
})


cambiarCategoria('todas')