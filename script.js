// Grace Tantra
// CSCI169 Spring 2021
// Javascript Final Project

// Statuses are used to change tile display in CSS
const HIDE = "hide"
const FLAG = "flag"
const SAFE = "safe"
const MINE = "mine"

// Tile "class"
function Tile(x, y) {
  this.element = document.createElement("div")
  this.element.dataset.status = HIDE

  this.x = x
  this.y = y

  this.mine = Math.random() * 10 < MINE_PROBABILITY

  this.getStatus = function() {
    return this.element.dataset.status
  }
  this.setStatus = function(val) {
    this.element.dataset.status = val
  }
  //for reset button
  this.resetMine = function() {
    this.mine = Math.random() * 10 < MINE_PROBABILITY
  }
}

// Creates the inital board for display
function createBoard() {
  let board = []
  for (let x = 0; x < BOARD_SIZE; x++) {
    let row = []
    for (let y = 0; y < BOARD_SIZE; y++) {
      row.push(new Tile(x, y))
    }
    board.push(row)
  }
  return board
}

// Flags a tile if user right-clicks
function flagTile(tile) {
  if (tile.getStatus() === FLAG) {
    tile.setStatus(HIDE)
  }
  else if (tile.getStatus() === HIDE) {
    tile.setStatus(FLAG)
  }
}

// Reveals a tile if user left-clicks
function revealTile(board, tile) {
  if (tile.mine && tile.getStatus() !== FLAG) {
    tile.setStatus(MINE)
  }
  else if (tile.getStatus() === HIDE){
    tile.setStatus(SAFE)
    let numMines = countNeighbourMines(board, tile)

    if (numMines === 0) {
      revealNeighbours(board, tile)
    }
    else {
      tile.element.textContent = numMines
    }
  }
}

// Counts number of mines in adjacent tiles
function countNeighbourMines(board, tile) {
  let count = 0
  let x = tile.x, y = tile.y
  if(x-1 >= 0 && y-1 >= 0 && board[x-1][y-1].mine) count++ //up left
  if(x-1 >= 0 && board[x-1][y].mine) count++ //up
  if(x-1 >= 0 && y+1 < BOARD_SIZE && board[x-1][y+1].mine) count++ //up right
  if(y-1 >= 0 && board[x][y-1].mine) count++ //left
  if(y+1 < BOARD_SIZE && board[x][y+1].mine) count++ //right
  if(x+1 < BOARD_SIZE && y-1 >= 0 && board[x+1][y-1].mine) count++ //down left
  if(x+1 < BOARD_SIZE && board[x+1][y].mine) count++ //down
  if(x+1 < BOARD_SIZE && y+1 < BOARD_SIZE && board[x+1][y+1].mine) count++ //down right
  return count
}

// Reveals all adjacent tiles
function revealNeighbours(board, tile) {
  let x = tile.x, y = tile.y
  if(x-1 >= 0 && y-1 >= 0) revealTile(board, board[x-1][y-1]) //up left
  if(x-1 >= 0) revealTile(board, board[x-1][y]) //up
  if(x-1 >= 0 && y+1 < BOARD_SIZE) revealTile(board, board[x-1][y+1]) //up right
  if(y-1 >= 0) revealTile(board, board[x][y-1]) //left
  if(y+1 < BOARD_SIZE) revealTile(board, board[x][y+1]) //right
  if(x+1 < BOARD_SIZE && y-1 >= 0) revealTile(board, board[x+1][y-1]) //down left
  if(x+1 < BOARD_SIZE) revealTile(board, board[x+1][y]) //down
  if(x+1 < BOARD_SIZE && y+1 < BOARD_SIZE) revealTile(board, board[x+1][y+1]) //down right
}

// Checks whether user won or lost, updates accordingly
function checkEndGame(tile) {
  if (checkWin(board)) {
    subtext.textContent = "you win! all mines avoided!! :)"
  }
  else if (checkLose(tile)) {
    subtext.textContent = "you lose :("
    revealAllTiles(board)
  }
}

// Checks board for completion (a win!)
function checkWin(board) {
  for(let x=0; x < BOARD_SIZE; x++) {
    for(let y=0; y < BOARD_SIZE; y++) {
      let s = board[x][y].getStatus()
      if(s === HIDE && !board[x][y].mine) return false
      if(s === FLAG && !board[x][y].mine) return false
    }
  }
  return true
}

// Checks board for a loss (if mine was clicked)
function checkLose(tile) {
  return tile.getStatus() === MINE
}

// Reveals all tiles (called if loss)
function revealAllTiles(board) {
  for(let x=0; x < BOARD_SIZE; x++) {
    for(let y=0; y < BOARD_SIZE; y++) {
      revealTile(board, board[x][y])
    }
  }
}

// Referenced WebDevSimplified on YouTube
// For how to build a playing board using document divs
function displayBoard(board) {
  for(let x=0; x < BOARD_SIZE; x++) {
    for(let y=0; y < BOARD_SIZE; y++) {
      boardElement.append(board[x][y].element)
      //left click (reveal)
      board[x][y].element.addEventListener("click", () => {
        revealTile(board, board[x][y])
        checkEndGame(board[x][y])
      })
      //right click (flag)
      board[x][y].element.addEventListener("contextmenu", click => {
        click.preventDefault() //prevents contextmenu from popping up
        flagTile(board[x][y])
      })
    }
  }
}

// refreshes display, changes mine locations
function refreshBoard(board) {
  for(let x=0; x < BOARD_SIZE; x++) {
    for(let y=0; y < BOARD_SIZE; y++) {
      board[x][y].resetMine()
      board[x][y].setStatus(HIDE)
      board[x][y].element.textContent = ""
      subtext.textContent = "avoid the mines!"
    }
  }
}

// "main"
const BOARD_SIZE = 10
const MINE_PROBABILITY = 2 //20%

var board = createBoard()
const boardElement = document.querySelector(".board")
const subtext = document.querySelector(".subtext")
displayBoard(board)

boardElement.style.setProperty("--size", BOARD_SIZE)

// reset button click (calls refresh board)
document.getElementById("reset").onclick = function() {
  refreshBoard(board)
}



/*
Notes of Changes to Initial Outline:
- Don't display a tile's number if it's 0
- Win/Loss will get updated as subtext above the board
- Neighbours is checked upon reveal rather than having two iterations
- Reset button updates board, rather than creating a new one

INITIAL OUTLINE:

Tile ("class"):
(1) Tiles can be (1) Hidden/Default, (2) Flag, (3) Number/Blank, (4) Mine
(2) (x, y) board coordinates
(3) Mine (true/false)
(4) Neighbours (count of adjacent mines)
    --> Needs a second passover after board creation
(5) Function to change the display using status (1)

Functions:
(1) Create the full board
(2) Flag tile (3) Reveal tile
(4) Check for win (5) Check for loss
(6) Update neighbours
    --> Passes over created board, updates neighbours for each square

Other (Optional):
(1) Revealing a 0 reveals everything around it
(2) Display all squares if lose
(3) Reset button creates a new board
(4) Populate mines upon first click (first square safe)
(5) Win/Loss pops up on top of board after game
*/
