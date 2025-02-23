import { songs } from "../main.js";

/**
 * @author Diego Alonso Molina
 * @GitHub https://github.com/DiegusNueva/Juego-2048
 */

let musicStarted = false;

/**
 * Reproduce música de fondo aleatoria cuando se hace clic o se presiona una tecla.
 * La música se selecciona de una lista de canciones predefinidas y se reproduce en un bucle
 * con un volumen del 50%. Si la reproducción automática está bloqueada, se captura el error.
 */
const playMusic = () => {
  if (!musicStarted) {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    bgMusic.src = randomSong;
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
    bgMusic.play().catch((error) => console.log("Autoplay bloqueado"));
    musicStarted = true;
  }
};

export default playMusic;
