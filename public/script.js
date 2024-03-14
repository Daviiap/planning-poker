const socket = io('/')
const usersGrid = document.getElementById('users-grid')

var voted = false
var vote = 0

socket.on('user-connected', (userId, userName) => {
    addUser(userId, userName)
    const input = document.getElementById('name-input')

    socket.emit('sync', userId, input.value, voted)
})

socket.on('sync', (userId, userName, userVoted) => {
    addUser(userId, userName)
    if (userVoted) {
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
    userDiv.children[0].innerHTML = vote
    socket.emit('show-vote', socket.id, vote)
})

socket.on('show-vote', (userId, vote) => {
    const userDiv = document.getElementById(userId)
    userDiv.children[0].innerHTML = vote
})

socket.on('register-vote', userId => {
    registerVote(userId)
})

socket.on('new-vote', () => {
    vote = 0
    voted = false
    for (let i = 0; i < usersGrid.children.length; i++) {
        userDiv = usersGrid.children[i]
        userDiv.children[0].innerHTML = ""
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
    userDiv.children[0].innerHTML = vote
}

function newVote() {
    vote = 0
    voted = false
    socket.emit('new-vote')
    for (let i = 0; i < usersGrid.children.length; i++) {
        userDiv = usersGrid.children[i]
        userDiv.children[0].innerHTML = ""
        userDiv.style.backgroundColor = 'aqua'
    }
}

function join() {
    const input = document.getElementById('name-input')

    socket.emit('join-room', ROOM_ID, input.value)
    addUser(socket.id, input.value)

    document.getElementById('name-selection-div').remove()
    const container = document.getElementById('opts-container')
    container.innerHTML = `
    <div id="vote-opts">
        <button onclick="voteHandler(this)">1</button>
        <button onclick="voteHandler(this)">2</button>
        <button onclick="voteHandler(this)">3</button>
        <button onclick="voteHandler(this)">5</button>
        <button onclick="voteHandler(this)">8</button>
        <button onclick="voteHandler(this)">13</button>
        <button onclick="voteHandler(this)">21</button>
        <button id="show-button" onclick="showValues()">Show<br/>Values</button>
        <button id="new-vote-button" onclick="newVote()">New Vote</button>
    </div>
    `
}

function registerVote(userId) {
    const userDiv = document.getElementById(userId)
    userDiv.style.backgroundColor = '#90ee90'
}

function addUser(userId, userName) {
    const userDiv = document.createElement('div')
    userDiv.className = 'user'
    userDiv.id = userId

    const userVote = document.createElement('div')
    userVote.className = 'user-vote'

    const userNameP = document.createElement('p')
    userNameP.innerHTML = userName
    userNameP.className = 'user-name'

    userDiv.append(userVote)
    userDiv.append(userNameP)
    usersGrid.append(userDiv)
}
