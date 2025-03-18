const startButton = document.getElementById("start-button");
const board = document.getElementById("game-board");
const dialogButton = document.getElementById("dialog-button");
const dialog = document.getElementById("dialog");
const dialogText = document.getElementById("dialog-text");

let boardSize = 0
let minesCount = 0
let currentRevealedCell = 0
let gameIsFinished = false

function startGame() {
    boardSize = parseInt(document.getElementById("board-size").value)
    minesCount = parseInt(document.getElementById("mine-count").value)
    currentRevealedCell = 0
    gameIsFinished = false
    board.classList.remove("empty")
    board.innerHTML = ""
    board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`

    createBoard()
    placeMines()
    calculateNeighbours()
}

function createBoard() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
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
    while (placedMinesCount < minesCount) {
        let row = Math.floor(Math.random() * boardSize)
        let col = Math.floor(Math.random() * boardSize)
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
        if (!cell.dataset.ismine) {
            cell.setAttribute("data-ismine", `${true}`)
            placedMinesCount++
        }
    }
}

function calculateNeighbours() {
    const cells = document.querySelectorAll(".cell")
    const direction = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    cells.forEach(cell => {
        if (cell.dataset.ismine) return
        let minesCount = 0
        let cr = parseInt(cell.dataset.row)
        let cc = parseInt(cell.dataset.col)
        direction.forEach(([dr, dc]) => {
            const neighbour = document.querySelector(`.cell[data-row="${cr + dr}"][data-col="${cc + dc}"]`)
            if (neighbour && neighbour.dataset.ismine) {
                minesCount++
            }
        })
        cell.setAttribute("data-minescount", `${minesCount}`)
    })
}

function revealNeighbours(cell) {
    const direction = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    let cr = parseInt(cell.dataset.row)
    let cc = parseInt(cell.dataset.col)

    if (cell.dataset.ismine) return

    if(!cell.dataset.isrevealed) {
        cell.setAttribute("data-isrevealed", `${true}`)
        cell.classList.add("revealed")
        currentRevealedCell++
    }

    if (cell.dataset.isflagged) {
        cell.setAttribute("data-isflagged", `${false}`)
        cell.classList.remove("flagged")
    }

    if (cell.dataset.minescount > "0") {
        cell.textContent = cell.dataset.minescount
        return
    }

    direction.forEach(([dr, dc]) => {
        const neighbour = document.querySelector(`.cell[data-row="${cr + dr}"][data-col="${cc + dc}"]`)
        if (neighbour && !neighbour.dataset.isrevealed) {
            revealNeighbours(neighbour)
        }
    })
}

function revealCell(info) {
    if (gameIsFinished || info.target.dataset.isrevealed || !info.target.classList.contains("cell")) return null

    info.target.setAttribute("data-isrevealed", `${true}`)
    currentRevealedCell++
    info.target.classList.add("revealed")

    if (info.target.dataset.isflagged) {
        info.target.classList.remove("flagged")
    }

    if (info.target.dataset.ismine) {
        info.target.classList.add("mine")
        gameIsFinished = true
        gameOver(false)
    }

    if (currentRevealedCell === ((boardSize * boardSize) - minesCount)) {
        gameOver(true)
    }

    if (info.target.dataset.minescount > "0") {
        info.target.textContent = info.target.dataset.minescount
    } else {
        revealNeighbours(info.target)
    }
}

function flagCell(event) {
    event.preventDefault()
    if (event.target.dataset.isrevealed || event.target.dataset.isflagged || !event.target.classList.contains("cell")) return null

    event.target.setAttribute("data-isflagged", `${true}`)
    event.target.classList.add("flagged")
}

function gameOver(isWin) {
    dialogButton.innerText = isWin ? "Отлично." : "Начать игру заново."
    dialogText.innerText = isWin ? "Игра успешно пройдена. 🔥" : "Упс... Вы" +
        " проиграли" +
        " 😔"
    dialog.showModal()
}

startButton.addEventListener("click", startGame);
dialogButton.addEventListener("click", () => {
    board.innerHTML = ""
    board.classList.add("empty")
    dialog.close()
})