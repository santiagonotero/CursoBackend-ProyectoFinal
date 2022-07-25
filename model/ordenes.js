const mongoose = require('mongoose')

class Ordenes {

    constructor() {

        const schema = new mongoose.Schema({
            id: Number, 
            email: String,
            estado: String,
            numero: Number,
            timestamp: {type: Number, default: Date.now()},
            items:{
                productID: String,
                cantidad: Number
            }
        })
        this.data=[]
        this.model = mongoose.model('ordenes', schema)
    }

}