let socket = io.connect("http://localhost:8080", { forceNew: true });

let date = new Date()

async function addNewUser(e){
    let email = document.getElementById('email')
    let password1 = document.getElementById('password1')
    let password2 = document.getElementById('password2')

    try{
        if(password1.value === password2.value){  
            let userData={
                nombre: nombre.value,
                apellido: apellido.value,
                telefono: telefono.value,
                email: email.value,
                password: password1.value,
            }
            const response = await fetch('/signup', { 
                method: 'POST', 
                //mode:"no-cors",
                body: JSON.stringify(userData), 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()
            console.log(result)
            alert('')
            return false
        }
        else{
            window.alert('Ambas contraseñas deben coincidir')
            return false
        }
    }
    catch(e){
        return(e)
    }
}    

async function addToCart(idProducto){
    const res = await fetch(`/carrito/${idProducto}/productos`, {method: 'POST'})
    const res2 = await res.json()
        return false
}

async function finalizarCompra(){
    const res = await fetch('/carrito/finalizarcompra', {method: 'POST', headers:{'Content-Type': 'application/json'}})
    const res2 = await res.json()
    console.log(res2)
    window.location.href='/carrito/finalizarcompra'
}

async function addMessage(){
    let globalEmail = await userEmail
    const messageField = document.getElementById('userMessage')
    let message={
        email: globalEmail,
        mensaje: messageField.value,
        tipo: 'usuario',
        fecha: date.getDate() +'/' + (date.getMonth() +1) + '/' + date.getFullYear(),
        hora: date.getHours()+ ':' + date.getMinutes().toPrecision(2) + ':' + date.getSeconds().toPrecision(2)
    }
    socket.emit('newMessage', message)
    messageField.value = ''
    return false
}
