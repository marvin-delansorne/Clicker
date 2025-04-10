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
        showModal("Ceci n'est pas encore prêt, mais bientôt !", "./public/assets/dofusocre.png");
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

    // Sélectionne un Dofus aléatoire
    const randomIndex = Math.floor(Math.random() * (dofusItems.length / 4)); // Divisé par 4 à cause des duplications
    const selectedDofus = dofusItems[randomIndex];

    // Calcule la position pour s'arrêter sur le Dofus sélectionné
    const itemWidth = dofusItems[0].offsetWidth + 20; // Largeur d'un Dofus + l'espacement (gap)
    const offset = randomIndex * itemWidth; // Position du Dofus sélectionné
    const visibleWidth = wheel.parentElement.offsetWidth; // Largeur visible de la roue
    const centerOffset = (visibleWidth - itemWidth) / 2; // Centrer le Dofus sélectionné

    // Ajuste la transformation pour centrer le Dofus sélectionné
    const finalPosition = -(offset - centerOffset);
    wheel.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)"; // Animation fluide
    wheel.style.transform = `translateX(${finalPosition}px)`; // Utilise translateX pour une roue horizontale

    // Réinitialise la position après l'animation
    setTimeout(() => {
        wheel.style.transition = "none"; // Désactive la transition pour éviter un saut visible
        wheel.style.transform = `translateX(0)`; // Réinitialise la position

        // Récupère les informations du Dofus
        const dofusName = selectedDofus.alt;
        const dofusCara = selectedDofus.dataset.caraDofus;

        // Affiche le résultat
        if (dofusName === "Ocre") {
            parsedKamas += 100000; // Ajoute 100 000 kamas
            elements.kamas.innerHTML = Math.round(parsedKamas);
            showToast(`Félicitations ! ${dofusCara}`, "wheel-toast", selectedDofus.src);
        } else {
            showToast(`Effet : ${dofusCara}`, "wheel-toast", selectedDofus.src);
        }

        isSpinning = false; // Permet de relancer la roue
    }, 3000);
}

function duplicateDofus() {
    const wheel = document.querySelector(".dofus-wheel");
    if (!wheel) {
        console.error("Le conteneur .dofus-wheel est introuvable !");
        return;
    }

    const dofusItems = Array.from(wheel.children);
    if (dofusItems.length === 0) {
        console.error("Aucun Dofus trouvé dans la roue pour duplication !");
        return;
    }

    const originalCount = dofusItems.length;

    // Clone les Dofus plusieurs fois pour simuler un effet infini
    for (let i = 0; i < 4; i++) { // Ajustez le nombre de duplications si nécessaire
        dofusItems.forEach((item) => {
            const clone = item.cloneNode(true);
            wheel.appendChild(clone);
        });
    }

    console.log("Dofus dupliqués :", wheel.children.length);
}

function showToast(message, customClass = "", imageSrc = null) {
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
        console.error("Toast container introuvable !");
        return;
    }

    // Crée un nouvel élément toast
    const toast = document.createElement("div");
    toast.className = `toast show ${customClass}`;

    // Ajoute le contenu du toast
    toast.innerHTML = `
        ${imageSrc ? `<img src="${imageSrc}" alt="Dofus" class="toast-image">` : ""}
        <span>${message}</span>
    `;

    // Ajoute le toast au conteneur
    toastContainer.appendChild(toast);

    // Supprime le toast après 4 secondes
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500); // Supprime l'élément après l'animation
    }, 4000);
}

async function loadDofusData() {
    try {
        const response = await fetch("./public/data.json");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données JSON");
        }
        const data = await response.json();
        initializeWheel(data.dofus);
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function initializeWheel(dofusList) {
    const wheel = document.querySelector(".dofus-wheel");
    if (!wheel) {
        console.error("Le conteneur .dofus-wheel est introuvable !");
        return;
    }

    // Vide la roue avant d'ajouter les Dofus
    wheel.innerHTML = "";

    // Ajoute chaque Dofus à la roue
    dofusList.forEach((dofus) => {
        const dofusElement = document.createElement("img");
        dofusElement.src = dofus.image;
        dofusElement.alt = dofus.nom;
        dofusElement.classList.add("dofus-item");
        dofusElement.dataset.caraDofus = dofus["cara-dofus"]; // Ajoute la caractéristique au dataset
        wheel.appendChild(dofusElement);
    });

    console.log("Dofus ajoutés :", wheel.children.length);

    // Duplique les Dofus pour un effet de carrousel
    duplicateDofus();
}

// Sauvegarde l'état de la roue dans le localStorage
function saveWheelState() {
    const wheelState = {
        parsedKamas,
        isSpinning
    };

    localStorage.setItem('wheelState', JSON.stringify(wheelState));
    console.log("État de la roue sauvegardé :", wheelState);
}

// Charge l'état de la roue depuis le localStorage
function loadWheelState() {
    const savedWheelState = localStorage.getItem('wheelState');
    if (!savedWheelState) return;

    const wheelState = JSON.parse(savedWheelState);
    parsedKamas = wheelState.parsedKamas || 0;
    isSpinning = wheelState.isSpinning || false;

    elements.kamas.innerHTML = Math.round(parsedKamas);
    console.log("État de la roue chargé :", wheelState);
}

// Appelez cette fonction lorsque la page est chargée
window.addEventListener("DOMContentLoaded", () => {
    loadDofusData();
});