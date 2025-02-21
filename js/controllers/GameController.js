import { game } from "../main.js";

export default function handleMove(direction) {
  let oldBoard = JSON.parse(JSON.stringify(game.board));
  let moved = false;

  switch (direction) {
    case "ArrowRight":
    case "d": // Tecla D
      moved = game.moveRight();
      break;
    case "ArrowLeft":
    case "a": // Tecla A
      moved = game.moveLeft();
      break;
    case "ArrowUp":
    case "w": // Tecla W
      moved = game.moveUp();
      break;
    case "ArrowDown":
    case "s": // Tecla S
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.animateMove(oldBoard, game.board, () => {
      game.addNewNumber();
      game.drawBoard();

      if (game.hasWon()) {
        document.getElementById("gameCanvas").style.background = "#228B22"; // Verde oscuro
        setTimeout(() => alert("🎉 ¡Has ganado! 🎉"), 100);
        return;
      }

      if (game.isBoardFull() && !game.hasValidMoves()) {
        document.getElementById("gameCanvas").style.background = "#8b0000"; // Rojo oscuro
        setTimeout(() => alert("¡Juego terminado! No hay más movimientos."), 100);
      }
    });
  }
}
