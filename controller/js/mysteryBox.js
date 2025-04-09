function handleMysteryBoxClick(imageSrc) {
    const mysteryCost = 30000;

    if (parsedKamas < mysteryCost) {
        showModal("Vous n'avez pas assez de kamas pour ouvrir cette boîte !");
        return;
    }

    // Déduire le coût
    parsedKamas -= mysteryCost;
    kamas.innerHTML = Math.round(parsedKamas);

    // Vérifier l'image cliquée
    if (imageSrc.includes("dofusocre.png")) {
        parsedKamas += 100000; // Ajouter 100 000 kamas
        elements.kamas.innerHTML = Math.round(parsedKamas);
        showModal("Félicitations ! Vous avez gagné 100 000 kamas !");
    } else {
        showModal("Ceci n'est pas encore prêt, mais bientôt !");
    }
}

function showModal(message) {
    const modal = document.getElementById("mystery-modal");
    const modalMessage = document.getElementById("modal-message");

    modalMessage.textContent = message;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("mystery-modal");
    modal.style.display = "none";
}

let isSpinning = false;

function openWheelModal() {
    const modal = document.getElementById("wheel-modal");
    modal.style.display = "block";
}

function closeWheelModal() {
    const modal = document.getElementById("wheel-modal");
    modal.style.display = "none";

    const wheel = document.querySelector(".dofus-wheel");
    wheel.style.animationPlayState = "running"; // Relance l'animation
}

function spinWheel() {
    console.log("SpinWheel appelé, parsedKamas avant :", parsedKamas);
    const spinCost = 30000;

    if (parsedKamas < spinCost) {
        showToast("Vous n'avez pas assez de kamas pour lancer la roue !");
        return;
    }

    parsedKamas -= spinCost;
    elements.kamas.innerHTML = Math.round(parsedKamas);

    if (isSpinning) return; // Empêche de relancer la roue pendant qu'elle tourne
    isSpinning = true;

    const wheel = document.querySelector(".dofus-wheel");
    const dofusItems = document.querySelectorAll(".dofus-item");

    // Ajoute la classe pour activer l'animation
    wheel.classList.add("spin");

    // Arrête l'animation après 3 secondes
    setTimeout(() => {
        wheel.classList.remove("spin"); // Désactive l'animation

        // Sélectionne un Dofus aléatoire
        const randomIndex = Math.floor(Math.random() * dofusItems.length);
        const selectedDofus = dofusItems[randomIndex];

        // Affiche le résultat
        if (selectedDofus.src.includes("dofusocre.png")) {
            parsedKamas += 100000; // Ajoute 100 000 kamas
            elements.kamas.innerHTML = Math.round(parsedKamas);
            showToast("Félicitations ! Vous avez gagné 100 000 kamas !", "wheel-toast");
        } else {
            showToast("Ceci n'est pas encore prêt, mais bientôt !", "wheel-toast");
        }

        isSpinning = false; // Permet de relancer la roue
    }, 3000); // Temps augmenté à 3 secondes
}

function initializeCarousel() {
    const wheel = document.querySelector(".dofus-wheel");
    const dofusItems = Array.from(wheel.children);

    // Duplique les Dofus pour créer un effet infini
    dofusItems.forEach((item) => {
        const clone = item.cloneNode(true);
        wheel.appendChild(clone);
    });
}

function showToast(message, customClass = "") {
    const toastContainer = document.getElementById("toast-container");

    // Crée un nouvel élément toast
    const toast = document.createElement("div");
    toast.className = `toast show ${customClass}`;
    toast.textContent = message;

    // Ajoute le toast au conteneur
    toastContainer.appendChild(toast);

    // Supprime le toast après 4 secondes
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500); // Supprime l'élément après l'animation
    }, 4000);
}

// Appelez cette fonction lorsque la page est chargée
window.addEventListener("DOMContentLoaded", initializeCarousel);