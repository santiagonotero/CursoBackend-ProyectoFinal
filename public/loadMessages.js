let userEmail

const plantillaChat = `
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Autor</th>
                                        <th>Mensaje</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{#each messages}}
                                    <tr>
                                        <td><p>{{this.email}}</p></td>
                                        <td><p>{{this.mensaje}}</p></td>
                                        <td><p>{{this.fecha}}</p></td>
                                        <td><p>{{this.hora}}</p></td>
                                    </tr>
                                    {{/each}}
                                </tbody>
                            </table> 
                        </div>
                        `

async function getUserEmail(){
    const query = await fetch('/api/currentuser', {headers: {'Content-Type': 'application/json'}})
    const response = await query.json()
    return await response.email
}

userEmail = getUserEmail()

socket.emit("requestMessages")

socket.on('loadMessages', (messages)=>{
    let plantilla= plantillaChat 
    let compiler = Handlebars.compile(plantilla)
    let result = compiler({messages})
    let messagePool=document.getElementById('messagePool')
    messagePool.innerHTML = result
})