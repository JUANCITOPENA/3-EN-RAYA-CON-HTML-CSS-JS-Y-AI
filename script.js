const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restart");
let board = ["", "", "", "", "", "", "", "", ""];
const humanPlayer = "X";
const aiPlayer = "O";

// Patrón de combinaciones ganadoras
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Función para verificar si hay un ganador
function checkWinner(currentBoard, player) {
    for (let pattern of winPatterns) {
        if (pattern.every(index => currentBoard[index] === player)) {
            return true;
        }
    }
    return false;
}

// Manejo del clic en la celda
function handleCellClick(event) {
    const index = event.target.getAttribute("data-index");
    if (board[index] === "" && !checkWinner(board, humanPlayer) && !checkWinner(board, aiPlayer)) {
        board[index] = humanPlayer;
        renderBoard();
        if (!checkWinner(board, humanPlayer) && !board.every(cell => cell !== "")) {
            bestMove();
        }
    }
}

// Renderiza el tablero
function renderBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });

    if (checkWinner(board, humanPlayer)) {
        setTimeout(() => alert("¡Has ganado!"), 100);
    } else if (checkWinner(board, aiPlayer)) {
        setTimeout(() => alert("¡Has perdido!"), 100);
    } else if (board.every(cell => cell !== "")) {
        setTimeout(() => alert("¡Es un empate!"), 100);
    }
}

// Encuentra el mejor movimiento para la IA
function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = aiPlayer;
    renderBoard();
}

// Implementación del algoritmo Minimax
function minimax(newBoard, depth, isMaximizing) {
    if (checkWinner(newBoard, aiPlayer)) return 10;
    if (checkWinner(newBoard, humanPlayer)) return -10;
    if (newBoard.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = aiPlayer;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = humanPlayer;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Reiniciar el juego
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    renderBoard();
}

// Agregar eventos
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);

// Renderizar el tablero por primera vez
renderBoard();
