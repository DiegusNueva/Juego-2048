const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 3; // Tablero de 3x3
const TILE_SIZE = 100;
canvas.width = TILE_SIZE * SIZE;
canvas.height = TILE_SIZE * SIZE;

document.getElementById("restartBtn").addEventListener("click", () => {
  game.restart();
});
document.addEventListener("keydown", (event) => {
  let moved = false;
  switch (event.key) {
    case "ArrowRight":
    case "d":
      moved = game.moveRight();
      break;
    case "ArrowLeft":
    case "a":
      moved = game.moveLeft();
      break;
    case "ArrowUp":
    case "w":
      moved = game.moveUp();
      break;
    case "ArrowDown":
    case "s":
      moved = game.moveDown();
      break;
  }
  if (moved) {
    game.addNewNumber();
    game.drawBoard();

    if (game.isBoardFull() && !game.hasValidMoves()) {
      setTimeout(() => alert("¡Juego terminado! No hay más movimientos."), 100);
    }
  }
});

class Game2048 {
  constructor() {
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.score = 0;
    this.addNewNumber();
    this.addNewNumber();
    this.drawBoard();
    this.updateScore();
  }

  updateScore() {
    document.getElementById("score").textContent = this.score;
  }

  restart() {
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); // Limpia el tablero
    this.score = 0; // Reinicia la puntuación
    this.addNewNumber();
    this.addNewNumber();
    this.drawBoard();
    this.updateScore();
  }

  addNewNumber() {
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
  }

  drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        this.drawTile(r, c, this.board[r][c]);
      }
    }
  }

  drawTile(row, col, value, offsetX = 0, offsetY = 0) {
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
  }

  animateMove(oldBoard, newBoard, callback) {
    let frames = 10; // Duración de la animación
    let step = 1 / frames;
    let progress = 0;

    const animate = () => {
      progress += step;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          let oldVal = oldBoard[r][c];
          let newVal = newBoard[r][c];

          if (oldVal !== 0 && newVal === 0) continue; // Evita dibujar números eliminados

          let offsetX = 0,
            offsetY = 0;
          if (oldVal !== newVal && oldVal !== 0) {
            // Si el número ha cambiado
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
  }

  findOldPos(oldBoard, value, row, col) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (oldBoard[r][c] === value) {
          return { r, c };
        }
      }
    }
    return { r: row, c: col };
  }

  moveRight() {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
      let newRow = this.board[r].filter((val) => val); // Elimina ceros
      for (let c = newRow.length - 1; c > 0; c--) {
        if (newRow[c] === newRow[c - 1]) {
          // Si dos números son iguales
          newRow[c] *= 2;
          this.score += newRow[c]; // SUMA PUNTOS
          newRow[c - 1] = 0; // Elimina el duplicado
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val); // Vuelve a eliminar ceros
      while (newRow.length < SIZE) newRow.unshift(0); // Rellena con ceros a la izquierda
      if (!this.arraysEqual(this.board[r], newRow)) moved = true;
      this.board[r] = newRow;
    }
    this.updateScore();
    return moved;
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  moveLeft() {
    this.rotateBoard(); // Rota 180 grados
    this.rotateBoard();
    let moved = this.moveRight(); // Reutiliza moveRight()
    this.rotateBoard();
    this.rotateBoard();
    this.updateScore();
    return moved;
  }

  moveUp() {
    this.rotateBoard();
    let moved = this.moveRight();
    this.rotateBoard();
    this.rotateBoard();
    this.rotateBoard();
    this.updateScore();
    return moved;
  }

  moveDown() {
    this.rotateBoard();
    this.rotateBoard();
    this.rotateBoard();
    let moved = this.moveRight();
    this.rotateBoard();
    this.updateScore();
    return moved;
  }

  rotateBoard() {
    let newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        newBoard[c][SIZE - 1 - r] = this.board[r][c];
      }
    }
    this.board = newBoard;
  }

  isBoardFull() {
    return this.board.every((row) => row.every((cell) => cell !== 0));
  }

  hasValidMoves() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        let current = this.board[r][c];

        if (current === 0) return true; // Si hay un 0, aún hay espacio

        // Verifica derecha y abajo (para evitar doble comprobación)
        if (c < SIZE - 1 && current === this.board[r][c + 1]) return true;
        if (r < SIZE - 1 && current === this.board[r + 1][c]) return true;
      }
    }
    return false; // No hay movimientos válidos
  }
}

const game = new Game2048();
