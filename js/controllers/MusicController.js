import { songs } from "../main.js";

let musicStarted = false; // Se maneja localmente

export default function playMusic() {
  if (!musicStarted) {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    bgMusic.src = randomSong;
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
    bgMusic.play().catch((error) => console.log("Autoplay bloqueado"));
    musicStarted = true; // Se actualiza solo dentro del módulo
  }
}