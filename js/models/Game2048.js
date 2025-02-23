import { SIZE, ctx, canvas, TILE_SIZE } from "../main.js";

/**
 * @author Diego Alonso Molina
 * @GitHub https://github.com/DiegusNueva/Juego-2048
 */

export default class Game2048 {
  constructor() {
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.score = 0;
    this.maxScore = parseInt(localStorage.getItem("maxScore")) || 0;
    this.addNewNumber();
    this.addNewNumber();
    this.drawBoard();
    this.updateScore();
  }

  // Actualiza el puntaje en la pantalla
  updateScore = () => {
    document.getElementById("score").textContent = this.score;

    // Si la puntuación actual es mayor que la máxima, actualízala en el localStorage
    if (this.score > this.maxScore) {
      this.maxScore = this.score;
      localStorage.setItem("maxScore", this.maxScore); // Guardar la nueva puntuación máxima
    }
  };

  // Reinicia el juego: limpia el tablero y restablece la puntuación
  restart = () => {
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.score = 0;
    this.addNewNumber();
    this.addNewNumber();
    this.drawBoard();
    this.updateScore();
    document.getElementById("gameCanvas").style.background = "#bbada0";
  };

  // Añade un nuevo número (2) en una celda vacía aleatoria
  addNewNumber = () => {
    let emptyTiles = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.board[r][c] === 0) emptyTiles.push({ r, c });
      }
    }
    if (emptyTiles.length > 0) {
      let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      this.board[r][c] = 2;
    }
  };

  // Verifica si el jugador ha ganado (si existe un 2048 en el tablero)
  hasWon = () => {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  };

  // Dibuja el tablero y las fichas
  drawBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        this.drawTile(r, c, this.board[r][c]);
      }
    }
  };

  // Dibuja una ficha en la posición (row, col) con el valor correspondiente
  drawTile = (row, col, value, offsetX = 0, offsetY = 0) => {
    ctx.fillStyle = value ? "#eee4da" : "#cdc1b4";
    ctx.fillRect(
      col * TILE_SIZE + offsetX,
      row * TILE_SIZE + offsetY,
      TILE_SIZE - 5,
      TILE_SIZE - 5
    );
    if (value) {
      ctx.fillStyle = "#776e65";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        value,
        col * TILE_SIZE + TILE_SIZE / 2,
        row * TILE_SIZE + TILE_SIZE / 2
      );
    }
  };

  // Anima el movimiento de las fichas con una transición suave
  animateMove = (oldBoard, newBoard, callback) => {
    let frames = 10;
    let step = 1 / frames;
    let progress = 0;

    const animate = () => {
      progress += step;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          let oldVal = oldBoard[r][c];
          let newVal = newBoard[r][c];

          if (oldVal !== 0 && newVal === 0) continue;

          let offsetX = 0,
            offsetY = 0;
          if (oldVal !== newVal && oldVal !== 0) {
            offsetX =
              (c - this.findOldPos(oldBoard, oldVal, r, c).c) *
              TILE_SIZE *
              (1 - progress);
            offsetY =
              (r - this.findOldPos(oldBoard, oldVal, r, c).r) *
              TILE_SIZE *
              (1 - progress);
          }

          this.drawTile(r, c, newVal, offsetX, offsetY);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    animate();
  };

  // Encuentra la posición antigua de un valor específico en el tablero
  findOldPos = (oldBoard, value, row, col) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (oldBoard[r][c] === value) {
          return { r, c };
        }
      }
    }
    return { r: row, c: col };
  };

  // Mueve las fichas hacia la derecha y combina las iguales
  moveRight = () => {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
      let newRow = this.board[r].filter((val) => val);
      for (let c = newRow.length - 1; c > 0; c--) {
        if (newRow[c] === newRow[c - 1]) {
          newRow[c] *= 2;
          this.score += newRow[c];
          newRow[c - 1] = 0;
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val);
      while (newRow.length < SIZE) newRow.unshift(0);
      if (!this.arraysEqual(this.board[r], newRow)) moved = true;
      this.board[r] = newRow;
    }
    this.updateScore();
    return moved;
  };

  // Compara dos arreglos para ver si son iguales
  arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Mueve las fichas hacia la izquierda, reutilizando el método moveRight() con rotaciones
  moveLeft = () => {
    this.rotateBoard();
    this.rotateBoard();
    let moved = this.moveRight();
    this.rotateBoard();
    this.rotateBoard();
    this.updateScore();
    return moved;
  };

  // Mueve las fichas hacia arriba, reutilizando el método moveRight() con rotaciones
  moveUp = () => {
    this.rotateBoard();
    let moved = this.moveRight();
    this.rotateBoard();
    this.rotateBoard();
    this.rotateBoard();
    this.updateScore();
    return moved;
  };

  // Mueve las fichas hacia abajo, reutilizando el método moveRight() con rotaciones
  moveDown = () => {
    this.rotateBoard();
    this.rotateBoard();
    this.rotateBoard();
    let moved = this.moveRight();
    this.rotateBoard();
    this.updateScore();
    return moved;
  };

  // Rota el tablero 90 grados en sentido horario
  rotateBoard = () => {
    let newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        newBoard[c][SIZE - 1 - r] = this.board[r][c];
      }
    }
    this.board = newBoard;
  };

  // Verifica si el tablero está lleno
  isBoardFull = () => {
    return this.board.every((row) => row.every((cell) => cell !== 0));
  };

  // Verifica si hay movimientos válidos disponibles
  hasValidMoves = () => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        let current = this.board[r][c];

        if (current === 0) return true;

        if (c < SIZE - 1 && current === this.board[r][c + 1]) return true;
        if (r < SIZE - 1 && current === this.board[r + 1][c]) return true;
      }
    }
    return false;
  };
}
