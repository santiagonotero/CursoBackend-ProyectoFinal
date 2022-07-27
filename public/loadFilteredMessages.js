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

    const email = 'santiagonotero@gmail.com'
    console.log(email)
    return email
}

socket.on('loadMessages', (messages)=>{
    let plantilla= plantillaChat 
    let compiler = Handlebars.compile(plantilla)
    let result = compiler({messages})
    let messagePool=document.getElementById('messagePool')
    messagePool.innerHTML = result
})

const email = getUserEmail()

socket.emit("requestMessages", email)