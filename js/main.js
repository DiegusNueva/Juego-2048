import Game2048 from "./models/Game2048.js";
import playMusic from "./controllers/MusicController.js";
import handleMove from "./controllers/GameController.js";

// 🎵 Variables para la música de fondo
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;

// Configuración del lienzo (canvas) y contexto de dibujo
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const SIZE = 4;
export const TILE_SIZE = 100;
canvas.width = TILE_SIZE * SIZE;
canvas.height = TILE_SIZE * SIZE;

// 🎵 Lista de canciones disponibles para el juego
export const songs = [
  "audio/Twin Musicom - 8 Bit March (Dramatic).mp3",
  "audio/Pixelland.mp3",
];

// 🎶 Reproducción de música al hacer clic o presionar una tecla
document.addEventListener("click", () => playMusic());
document.addEventListener("keydown", () => playMusic());

// 🎮 Configuración de los botones del juego
document.getElementById("restartBtn").addEventListener("click", () => {game.restart();});
document.getElementById("upBtn").addEventListener("click", () => handleMove("ArrowUp"));
document.getElementById("downBtn").addEventListener("click", () => handleMove("ArrowDown"));
document.getElementById("leftBtn").addEventListener("click", () => handleMove("ArrowLeft"));
document.getElementById("rightBtn").addEventListener("click", () => handleMove("ArrowRight"));

// 🎮 Movimiento mediante teclas del teclado
document.addEventListener("keydown", (event) => {handleMove(event.key);});

// Inicialización del juego
export const game = new Game2048();
