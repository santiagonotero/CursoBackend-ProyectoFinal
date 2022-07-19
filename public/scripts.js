let socket = io.connect("http://localhost:8080", { forceNew: true });

let date = new Date()

async function addNewUser(e){
    let email = document.getElementById('email')
    let password1 = document.getElementById('password1')
    let password2 = document.getElementById('password2')

    if(password1.value === password2.value){  
        let userData={
            nombre: nombre.value,
            apellido: apellido.value,
            telefono: telefono.value,
            email: email.value,
            password: password1.value,
        }
        try{
            globalEmail = userData.email
            await fetch('/signup', {
                method: 'POST', 
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {if(response.status === 200) return true})
        }
        catch(e){console.error(e)}
    
    }
    else{
        window.alert('Ambas contraseñas deben coincidir')
        
        return false
    }
}    

async function addToCart(idProducto){

    const res = await fetch(`/api/carrito/${idProducto}/productos`, { method: 'POST' })

}

async function finalizarCompra(){

    const res = await fetch(`/api/carrito/finalizarcompra`, { method: 'POST' })
}

// socket.on('server:productList', (items)=>{
//     let plantilla=document.getElementById('plantillaProductos').innerHTML
//     let compile = Handlebars.compile(plantilla)
//     let result = compile({items})
//     let listado=document.getElementById("listado")
//     listado.innerHTML = result
// })

socket.on('loadMessages', (messages)=>{
    console.log(messages)
    let plantillaChat=document.getElementById('plantillaChat').innerHTML
    console.log(plantillaChat)
    let compile = Handlebars.compile(plantillaChat)
    let result = compile({messages})
    console.log({messages})
    console.log(result)
    let messagePool=document.getElementById('messagePool')
    messagePool.innerHTML = result
})

addMessage=(e)=>{
    let globalEmail = 'santiagonotero@gmail.com'
    const mensaje = document.getElementById('userMessage').value
    let message={
        email: globalEmail,
        mensaje: mensaje,
        tipo: 'usuario',
        fecha: date.getDate() +'/' + (date.getMonth() +1) + '/' + date.getFullYear(),
        hora: date.getHours()+ ':' + date.getMinutes().toPrecision(2) + ':' + date.getSeconds().toPrecision(2)

    }
    socket.emit('newMessage', message)
    return false
}
