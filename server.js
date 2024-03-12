const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const { v4: uuid } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (_, res) => {
    res.redirect(`/${uuid()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId)

        socket.to(roomId).emit('user-connected', socket.id)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', socket.id)
        })

        socket.on('sync', (userId, voted) => {
            socket.to(userId).emit('sync', socket.id, voted)
        })

        socket.on('vote', userId => {
            socket.to(roomId).emit('register-vote', userId)
        })

        socket.on('show-votes', () => {
            socket.to(roomId).emit('show-votes')
        })

        socket.on('new-vote', () => {
            socket.to(roomId).emit('new-vote')
        })

        socket.on('show-vote', (userId, vote) => {
            socket.to(roomId).emit('show-vote', userId, vote)
        })
    })
})

server.listen(3000)
