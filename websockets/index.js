//const app = require('express')
const path = require('path')
const logger = require("../Logs/winston")
//const server = require('http').createServer()
//let server = require('http').Server(app)
//const io = require('socket.io')(server)
const {port} = require('../config')

//module.exports={
    function genIo(io){
        io.on('connection', (socket)=>{
            socket.on('mensaje', (datos)=>{
                console.log('Hola: ', datos)
            })
        })
    }

module.exports = genIo