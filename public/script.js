const socket = io('/')
const usersGrid = document.getElementById('users-grid')

var voted = false
var vote = 0

socket.on('connect', () => {
    socket.emit('join-room', ROOM_ID)
    addUser(socket.id)
})

socket.on('user-connected', userId => {
    addUser(userId)
    socket.emit('sync', userId, voted)
})

socket.on('sync', (userId, voted) => {
    addUser(userId)
    if (voted) {
        registerVote(userId)
    }
})

socket.on('user-disconnected', userId => {
    const userDiv = document.getElementById(userId)
    if (userDiv) {
        userDiv.remove()
    }
})

socket.on('show-votes', () => {
    const userDiv = document.getElementById(socket.id)
    userDiv.innerHTML = vote
    socket.emit('show-vote', socket.id, vote)
})

socket.on('show-vote', (userId, vote) => {
    const userDiv = document.getElementById(userId)
    userDiv.innerHTML = vote
})

socket.on('register-vote', userId => {
    registerVote(userId)
})

socket.on('new-vote', () => {
    vote = 0
    voted = false
    for (let i = 0; i < usersGrid.children.length; i++) {
        userDiv = usersGrid.children[i]
        userDiv.innerHTML = ""
        userDiv.style.backgroundColor = 'aqua'
    }
})

function voteHandler(el) {
    voted = true
    vote = el.innerHTML
    registerVote(socket.id)
    socket.emit('vote', socket.id)
}

function showValues() {
    socket.emit('show-votes')
    socket.emit('show-vote', socket.id, vote)
    const userDiv = document.getElementById(socket.id)
    userDiv.innerHTML = vote
}

function newVote() {
    vote = 0
    voted = false
    socket.emit('new-vote')
    for (let i = 0; i < usersGrid.children.length; i++) {
        userDiv = usersGrid.children[i]
        userDiv.innerHTML = ""
        userDiv.style.backgroundColor = 'aqua'
    }
}

function registerVote(userId) {
    const userDiv = document.getElementById(userId)
    userDiv.style.backgroundColor = 'lightgreen'
}

function addUser(userId) {
    const userDiv = document.createElement('div')
    userDiv.className = 'user'
    userDiv.id = userId
    usersGrid.append(userDiv)
}
