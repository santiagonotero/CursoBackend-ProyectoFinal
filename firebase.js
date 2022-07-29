// const logger = require("./Logs/winston")

// class Firebase{

//     constructor(){
//         this.db
//     }

//     initFirebase (){
//         const admin = require('firebase-admin')
//         const {getFirestore} = require ('firebase-admin/firestore')

//         const serviceAccount = require('./DBconfig/Firebase/sdk.json')

//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount),
//             databaseURL:"https://Backend-Coderhouse-camada17070.firebaseio.com"
//         })

//         this.db = getFirestore()

//         logger.info("Conectado a Firestore")
//     }
// }
// module.exports = new Firebase

