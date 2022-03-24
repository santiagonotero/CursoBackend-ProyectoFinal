(async ()=>{
    console.log('IIFE')
    const admin = require('firebase-admin')
    const {getFirestore} = require ('firebase-admin/firestore')

    const serviceAccount = require('./Firebase/sdk.json')

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:"https://Backend-Coderhouse-camada17070.firebaseio.com"
    })

    const db = getFirestore()

    console.log("Conectado")

    const query = db.collection("productos")
    const data = await query.get()
    
})()