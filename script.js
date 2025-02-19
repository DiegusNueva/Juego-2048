const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 3; // Tablero de 3x3
const TILE_SIZE = 100;
canvas.width = TILE_SIZE * SIZE;
canvas.height = TILE_SIZE * SIZE;

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
  }
});

class Game2048 {
  constructor() {
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.addNewNumber();
    this.addNewNumber();
    this.drawBoard();
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

  drawTile(row, col, value) {
    ctx.fillStyle = value ? "#eee4da" : "#cdc1b4";
    ctx.fillRect(
      col * TILE_SIZE,
      row * TILE_SIZE,
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

  moveRight() {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
      let newRow = this.board[r].filter((val) => val); // Elimina ceros
      for (let c = newRow.length - 1; c > 0; c--) {
        if (newRow[c] === newRow[c - 1]) {
          // Si dos números son iguales
          newRow[c] *= 2;
          newRow[c - 1] = 0; // Elimina el duplicado
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val); // Vuelve a eliminar ceros
      while (newRow.length < SIZE) newRow.unshift(0); // Rellena con ceros a la izquierda
      if (!this.arraysEqual(this.board[r], newRow)) moved = true;
      this.board[r] = newRow;
    }
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
    return moved;
}

}

const game = new Game2048();
