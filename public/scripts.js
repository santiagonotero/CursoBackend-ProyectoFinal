let socket = io.connect("http://localhost:8080", { forceNew: true });

addNewUser=(e)=>{

    let userData={
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        avatar: document.getElementById('avatar').value,
    }
    console.log(userData.avatar)
    socket.emit('newUser', userData)
    
}


async function addToCart(idProducto){

    const res = await fetch(`/api/carrito/${idProducto}/productos`, { method: 'POST' })

}