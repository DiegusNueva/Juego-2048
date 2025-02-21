import { game } from "../main.js";

/**
 * Maneja el movimiento de las fichas en el juego cuando el jugador presiona las teclas de dirección
 * o las teclas W, A, S, D. Dependiendo de la tecla presionada, el tablero se actualiza y se
 * realiza el movimiento correspondiente. Si se ha hecho un movimiento, se anima la transición
 * y se revisa si el jugador ha ganado o si el juego ha terminado.
 *
 * @param {string} direction - La dirección del movimiento (puede ser una tecla de flecha o W, A, S, D).
 */
export default function handleMove(direction) {
  let oldBoard = JSON.parse(JSON.stringify(game.board));
  let moved = false;

  switch (direction) {
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
    game.animateMove(oldBoard, game.board, () => {
      game.addNewNumber();
      game.drawBoard();

      if (game.hasWon()) {
        document.getElementById("gameCanvas").style.background = "#228B22";
        setTimeout(() => alert("🎉 ¡Has ganado! 🎉"), 100);
        return;
      }

      if (game.isBoardFull() && !game.hasValidMoves()) {
        document.getElementById("gameCanvas").style.background = "#8b0000";
        setTimeout(() => alert("¡Juego terminado! No hay más movimientos."), 100);
      }
    });
  }
}
