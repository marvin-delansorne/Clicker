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
}

function spinWheel() {
    console.log("SpinWheel appelé, parsedKamas avant :", parsedKamas);
    const spinCost = 30000;

    if (parsedKamas < spinCost) {
        alert("Vous n'avez pas assez de kamas pour lancer la roue !");
        return;
    }

    parsedKamas -= spinCost;
    console.log("parsedKamas après déduction :", parsedKamas);
    elements.kamas.innerHTML = Math.round(parsedKamas);

    if (isSpinning) return; // Empêche de relancer la roue pendant qu'elle tourne
    isSpinning = true;

    const wheel = document.querySelector(".dofus-wheel");
    const dofusItems = document.querySelectorAll(".dofus-item");

    // Ajoute une animation de rotation
    wheel.style.animation = "spin-animation 2s linear";

    // Arrête l'animation après 2 secondes
    setTimeout(() => {
        wheel.style.animation = "none";

        // Sélectionne un Dofus aléatoire
        const randomIndex = Math.floor(Math.random() * dofusItems.length);
        const selectedDofus = dofusItems[randomIndex];

        // Affiche le résultat
        if (selectedDofus.src.includes("dofusocre.png")) {
            parsedKamas += 100000; // Ajoute 100 000 kamas
            elements.kamas.innerHTML = Math.round(parsedKamas);
            alert("Félicitations ! Vous avez gagné 100 000 kamas !");
        } else {
            alert("Ceci n'est pas encore prêt, mais bientôt !");
        }

        isSpinning = false; // Permet de relancer la roue
    }, 2000);
}