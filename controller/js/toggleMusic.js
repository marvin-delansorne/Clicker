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

// Désactiver la musique par défaut au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    const musicIcon = document.getElementById("music-icon");

    // Désactiver la musique et définir l'icône sur "Music Off"
    music.pause();
    musicIcon.src = "./public/assets/music-off.png";
});