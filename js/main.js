import { appData } from './data.js';
import { initAudioPlayer } from './audio.js';
import { renderUI } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa a Interface (Cards, Timeline, Contador)
    renderUI(appData);
    
    // Inicializa o Player de Áudio
    initAudioPlayer(appData.config);
});