const socket = io('/')
const usersGrid = document.getElementById('users-grid')

var voted = false
var myVote = 0
var myName = ''

socket.on('user-connected', (userId, userName) => {
    addUser(userId, userName)
    socket.emit('sync', userId, myName, voted)
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
    showVote(socket.id, myVote)
    socket.emit('show-vote', socket.id, myVote)
})

socket.on('show-vote', (userId, vote) => {
    showVote(userId, vote)
})

socket.on('register-vote', userId => {
    registerVote(userId)
})

socket.on('new-vote', () => {
    newVote()
})

function voteHandler(el) {
    voted = true
    myVote = el.innerHTML
    registerVote(socket.id)
    socket.emit('vote', socket.id)

    const optsBtns = document.getElementById('opts-buttons')
    for (let i = 0; i < optsBtns.children.length; i++) {
        const optBtn = optsBtns.children[i]
        optBtn.classList.remove('selected')
    }
    el.classList.add('selected')
}

function showVote(userId, value) {
    const userDiv = document.getElementById(userId)
    if (userDiv) {
        userDiv.children[0].innerHTML = value
        userDiv.classList.remove('voted')
    }
}

function showValuesBtnHandler() {
    socket.emit('show-votes')
    socket.emit('show-vote', socket.id, myVote)
    showVote(socket.id, myVote)
}

function newVote() {
    myVote = 0
    voted = false
    for (let i = 0; i < usersGrid.children.length; i++) {
        userDiv = usersGrid.children[i]
        userDiv.children[0].innerHTML = ''
        userDiv.classList.remove('voted')
    }
    const optsBtns = document.getElementById('opts-buttons')
    for (let i = 0; i < optsBtns.children.length; i++) {
        const optBtn = optsBtns.children[i]
        optBtn.classList.remove('selected')
    }
}

function newVoteBtnHandler() {
    newVote()
    socket.emit('new-vote')
}

function join() {
    const input = document.getElementById('name-input')
    myName = input.value

    socket.emit('join-room', ROOM_ID, input.value)
    addUser(socket.id, input.value)


    document.getElementById('name-selection-div').remove()
    const container = document.getElementById('opts-container')
    container.innerHTML = `
    <div id="vote-opts">
        <div id="opts-buttons">
            <button class="vote-opt-btn" onclick="voteHandler(this)">1</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">2</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">3</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">5</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">8</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">13</button>
            <button class="vote-opt-btn" onclick="voteHandler(this)">21</button>
        </div>
        <button id="show-button" onclick="showValuesBtnHandler()">Show<br />Values</button>
        <button id="new-vote-button" onclick="newVoteBtnHandler()">New Vote</button>
    </div>
    `
}

function registerVote(userId) {
    const userDiv = document.getElementById(userId)
    if (userDiv) {
        userDiv.classList.add('voted')
    }
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
