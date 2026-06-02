export function initAudioPlayer(config) {
    const audio = document.getElementById("bg-music");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = playPauseBtn.querySelector("i");
    const statusIndicator = document.getElementById("status-indicator");
    const statusText = document.getElementById("status-text");
    const statusIcon = statusIndicator.querySelector("i");
    const muteBtn = document.getElementById("mute-btn");
    const muteIcon = muteBtn.querySelector("i");

    audio.src = config.audioSrc;
    audio.volume = config.startVolume;

    let isPlaying = false;
    let isMuted = false;

    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
            playIcon.classList.replace("fa-pause", "fa-play");
            statusText.innerText = "Pausado";
            statusIcon.className = "fas fa-pause";
            statusIndicator.classList.remove("playing");
        } else {
            audio.play().catch(e => console.log("Autoplay bloqueado pelo navegador"));
            playIcon.classList.replace("fa-play", "fa-pause");
            statusText.innerText = "Tocando";
            statusIcon.className = "fas fa-music"; // Muda o ícone para uma notinha musical
            statusIndicator.classList.add("playing");
        }
        isPlaying = !isPlaying;
    };

    playPauseBtn.addEventListener("click", togglePlay);

    muteBtn.addEventListener("click", () => {
        if (isMuted) {
            audio.muted = false;
            muteIcon.classList.replace("fa-volume-mute", "fa-volume-up");
        } else {
            audio.muted = true;
            muteIcon.classList.replace("fa-volume-up", "fa-volume-mute");
        }
        isMuted = !isMuted;
    });
}