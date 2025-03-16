const startButton = document.getElementById("start-button");
const board = document.getElementById("game-board");

let boardSize = 10
let minesCount = 4
let currentRevealedCell = 0
let gameIsFinished = false

function startGame() {
    boardSize = parseInt(document.getElementById("board-size").value)
    minesCount = parseInt(document.getElementById("mine-count").value)
    currentRevealedCell = 0
    gameIsFinished = false
    board.classList.remove("empty")
    board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`

    createBoard()
    placeMines()
}

function createBoard() {
    for(let row = 0; row < boardSize; row++) {
        for(let col = 0; col < boardSize; col++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.setAttribute("data-row", `${row}`)
            cell.setAttribute("data-col", `${col}`)
            board.appendChild(cell)
        }
    }
    board.addEventListener("click", (event) => revealCell(event))
    board.addEventListener("contextmenu", (event) => flagCell(event))
}

function placeMines() {
    let placedMinesCount = 0
    while(placedMinesCount < minesCount) {
        let row = Math.floor(Math.random() * boardSize)
        let col = Math.floor(Math.random() * boardSize)
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
        if(!cell.dataset.ismine) {
            cell.setAttribute("data-ismine", `${true}`)
        }
        placedMinesCount++
    }
}

function revealCell(info) {
    if(gameIsFinished || info.target.dataset.isrevealed || !info.target.classList.contains("cell")) return null

    info.target.setAttribute("data-isrevealed", `${true}`)
    currentRevealedCell++
    info.target.classList.add("revealed")

    if(info.target.dataset.ismine) {
        info.target.classList.add("mine")
        gameIsFinished = true
    }

    if(info.target.dataset.isflagged) {
        info.target.classList.remove("flagged")
    }
}

function flagCell(event) {
    event.preventDefault()
    if(event.target.dataset.isrevealed || event.target.dataset.isflagged || !event.target.classList.contains("cell")) return null

    event.target.setAttribute("data-isflagged", `${true}`)
    event.target.classList.add("flagged")
}

startButton.addEventListener("click", startGame);