import Game2048 from "./models/Game2048.js";
import playMusic from "./controllers/MusicController.js";
import handleMove from "./controllers/GameController.js";

const bgMusic = document.getElementById("bgMusic");
let musicStarted = false; // Bandera para evitar múltiples reproducciones
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const SIZE = 4; // Tablero de 4x4
export const TILE_SIZE = 100;
canvas.width = TILE_SIZE * SIZE;
canvas.height = TILE_SIZE * SIZE;

// 🎵 Lista de canciones disponibles
export const songs = [
  "audio/Twin Musicom - 8 Bit March (Dramatic).mp3",
  "audio/Pixelland.mp3",
];

document.addEventListener("click", () => playMusic());
document.addEventListener("keydown", () => playMusic()); // Se activa con un clic (para evitar bloqueos en móviles)
document.getElementById("restartBtn").addEventListener("click", () => {game.restart();});
document.getElementById("upBtn").addEventListener("click", () => handleMove("ArrowUp"));
document.getElementById("downBtn").addEventListener("click", () => handleMove("ArrowDown"));
document.getElementById("leftBtn").addEventListener("click", () => handleMove("ArrowLeft"));
document.getElementById("rightBtn").addEventListener("click", () => handleMove("ArrowRight"));
document.addEventListener("keydown", (event) => {handleMove(event.key);});

export const game = new Game2048();