var express = require('express')
var app = express()
var server = require('http').createServer(app)
var port = 8080
var io = require('socket.io')(server)
var admin = require("firebase-admin")
var serviceAccount = require("./config/nodem-2edaa-firebase-adminsdk-f9x1k-3ef71d5f9d.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodem-2edaa.firebaseio.com"
})

var clients = []

io.on('connection', socket => {
  socket.emit('cont')
  socket.on('set_name', data => {
    socket.username = data.username
    console.log(socket.username)
    clients.push(socket.username)
    
  }) 

  socket.on('update-contacts', () => {
    socket.broadcast.emit('update-contacts', clients)
  })
  
  

  socket.on('message', data => {
    console.log(data)
    socket.broadcast.emit('message', data)
  })

  socket.on('disconnect', user => {
  //  console.log(user)
  })
})



app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port)






