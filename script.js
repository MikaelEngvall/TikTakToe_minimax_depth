const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';  // Player is 'X'
let gameActive = true;

// Toggle between light and dark modes
function toggleMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateButtonLabel(isDarkMode);
}

// Update button label based on mode
function updateButtonLabel(isDarkMode) {
    const modeToggleBtn = document.getElementById('modeToggleBtn');
    modeToggleBtn.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Apply saved theme on load or after reset
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateButtonLabel(isDarkMode);
}

function handleClick(event, index) {
    if (board[index] !== '' || !gameActive || currentPlayer === 'O') return;

    // Player's move
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        statusElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (isBoardFull()) {
        statusElement.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    // Computer's turn
    currentPlayer = 'O';
    statusElement.textContent = "Computer's turn";

    setTimeout(computerMove, 500); // Delay for a natural play experience
}

function computerMove() {
    if (!gameActive) return;

    const bestMove = minimax(board, 'O').index;  // Get the best move
    board[bestMove] = 'O';
    document.querySelectorAll('.cell')[bestMove].textContent = 'O';

    if (checkWin()) {
        statusElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (isBoardFull()) {
        statusElement.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    // Return turn to the player
    currentPlayer = 'X';
    statusElement.textContent = "Player X's turn";
}

function minimax(newBoard, player, depth = 0) {
    const emptyCells = newBoard.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);

    if (checkWinAI(newBoard, 'X')) return { score: -10 - depth };
    if (checkWinAI(newBoard, 'O')) return { score: 10 - depth };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X', depth + 1);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O', depth + 1);
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function checkWinAI(testBoard, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return testBoard[a] === player && testBoard[b] === player && testBoard[c] === player;
    });
}

function checkWin() {
    return checkWinAI(board, currentPlayer);
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    clearBoard();
    createBoard();
}

function clearBoard() {
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cellElement = document.createElement('div');
        cellElement.className = "cell";
        cellElement.addEventListener('click', (event) => handleClick(event, i));
        boardElement.appendChild(cellElement);
    }
}

createBoard();
statusElement.textContent = `Player ${currentPlayer}'s turn`;
