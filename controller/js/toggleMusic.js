function toggleMusic() {
    const music = document.getElementById("background-music");
    const musicIcon = document.getElementById("music-icon");

    if (music.paused) {
        music.play();
        musicIcon.src = "./public/assets/music-on.png"; // Icône pour "Musique activée"
    } else {
        music.pause();
        musicIcon.src = "./public/assets/music-off.png"; // Icône pour "Musique désactivée"
    }
}

// Optionnel : Lancer la musique automatiquement au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    music.volume = 0.5; // Réglez le volume initial
    music.play().catch(() => {
        console.log("Lecture automatique bloquée par le navigateur.");
    });
});