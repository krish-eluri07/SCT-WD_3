const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Human is always X
let isGameActive = true;
let isComputerMode = false;

// All 8 possible winning combinations on a 3x3 grid
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Game
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Check if cell is already played or game is paused
    if (board[clickedCellIndex] !== "" || !isGameActive) return;

    // Player Move
    makeMove(clickedCellIndex, currentPlayer);
    
    // Check Status after player move
    if (checkResult()) return;

    // Hand off to computer if mode is enabled
    if (isComputerMode && isGameActive) {
        currentPlayer = "O";
        statusElement.innerText = "Computer is thinking...";
        setTimeout(computerMove, 500); // Slight delay for realism
    } else {
        // Toggle turn in PvP mode
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusElement.innerText = `Player ${currentPlayer}'s turn`;
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player);
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusElement.innerText = isComputerMode && currentPlayer === "O" 
            ? "Computer Wins! 🤖" 
            : `Player ${currentPlayer} Wins! 🎉`;
        isGameActive = false;
        return true;
    }

    // Check for Draw
    if (!board.includes("")) {
        statusElement.innerText = "It's a Draw! 🤝";
        isGameActive = false;
        return true;
    }

    return false;
}

// Simple AI logic: 1. Win if possible, 2. Block player win, 3. Take random open spot
function computerMove() {
    if (!isGameActive) return;

    let move = findBestMove("O"); // Try to win
    if (move === null) move = findBestMove("X"); // Try to block
    if (move === null) {
        // Fallback to random move
        const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (move !== null) {
        makeMove(move, "O");
        if (!checkResult()) {
            currentPlayer = "X";
            statusElement.innerText = "Player X's turn";
        }
    }
}

// Helper for AI to simulate a winning scenario
function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const values = [board[a], board[b], board[c]];
        
        // If two spots are taken by the player and one is empty
        if (values.filter(v => v === player).length === 2 && values.filter(v => v === "").length === 1) {
            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }
    return null;
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusElement.innerText = "Player X's turn";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("X", "O");
    });
}

// Event Listeners
boardElement.addEventListener('click', handleCellClick);
restartBtn.addEventListener('click', restartGame);

pvpBtn.addEventListener('click', () => {
    isComputerMode = false;
    pvpBtn.classList.add('active');
    pvcBtn.classList.remove('active');
    restartGame();
});

pvcBtn.addEventListener('click', () => {
    isComputerMode = true;
    pvcBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    restartGame();
});