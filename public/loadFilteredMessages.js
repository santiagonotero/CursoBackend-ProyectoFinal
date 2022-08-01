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
                                    {{#each filteredMessages}}
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

    const query = await fetch('/api/currentuser')
    const response = await query.json()
    return response.email
}

socket.on('loadMessages', (filteredMessages)=>{
    let plantilla= plantillaChat 
    let compiler = Handlebars.compile(plantilla)
    let result = compiler({filteredMessages})
    let messagePool=document.getElementById('messagePool')
    messagePool.innerHTML = result
})

getUserEmail().then((email)=>{
    socket.emit("requestMessages", email)
})
