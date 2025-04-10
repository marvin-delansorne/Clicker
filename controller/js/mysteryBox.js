// Configuration des récompenses
const rewards = [
    { id: 1, image: "./public/assets/dofusemeraude.png", name: "Dofus Emeraude", rarity: "legendary", probability: 0.05, kamas: 1000000, weight: 1 },
    { id: 2, image: "./public/assets/dofusocre.png", name: "Dofus Ocre", rarity: "common", probability: 0.3, kamas: 50000, weight: 6 },
    { id: 3, image: "./public/assets/dofuspourpre.png", name: "Dofus Pourpre", rarity: "uncommon", probability: 0.25, kamas: 100000, weight: 4 },
    { id: 4, image: "./public/assets/dofusivoire.png", name: "Dofus Ivoire", rarity: "epic", probability: 0.15, kamas: 500000, weight: 2 },
    { id: 5, image: "./public/assets/dofusebene.png", name: "Dofus Ebène", rarity: "epic", probability: 0.15, kamas: 500000, weight: 2 },
    { id: 6, image: "./public/assets/dofusturquoise.png", name: "Dofus Turquoise", rarity: "rare", probability: 0.1, kamas: 250000, weight: 3 }
];

// Variables globales
let isSpinning = false;
let wheelAnimation = null;
let currentSpinCost = 50000; // Prix initial
const baseSpinCost = 50000; // Prix de base pour réinitialisation
const spinCostMultiplier = 1.5; // Augmentation de 50% à chaque utilisation
let spinCount = 0; // Nombre de spins effectués

// Initialisation des variables globales si elles n'existent pas
if (typeof parsedKamas === 'undefined') {
    window.parsedKamas = 100000;
}
if (typeof elements === 'undefined') {
    window.elements = {
        kamas: document.querySelector(".kamas-cost") || { innerHTML: "" }
    };
}

// Fonction pour formater les nombres avec séparateurs
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Mise à jour du texte du bouton de spin
function updateSpinButtonText() {
    const spinBtn = document.querySelector(".spin-btn");
    if (spinBtn) {
        spinBtn.textContent = `Tourner (${formatNumber(Math.round(currentSpinCost))} kamas)`;
    }
}

// Génération des éléments de la roue
function generateWheelItems() {
    const wheel = document.querySelector(".dofus-wheel");
    wheel.innerHTML = '';
    
    let wheelItems = [];
    rewards.forEach(reward => {
        for (let i = 0; i < reward.weight; i++) {
            wheelItems.push(reward);
        }
    });
    
    wheelItems = shuffleArray(wheelItems);
    
    wheelItems.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.className = "dofus-item";
        img.dataset.id = item.id;
        wheel.appendChild(img);
    });
    
    duplicateWheelItems();
    updateSpinButtonText();
}

// Mélange aléatoire du tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Duplication des éléments pour une roue infinie
function duplicateWheelItems() {
    const wheel = document.querySelector(".dofus-wheel");
    const items = Array.from(wheel.children);
    const targetCount = items.length * 5;
    
    while (wheel.children.length < targetCount) {
        items.forEach(item => {
            if (wheel.children.length < targetCount) {
                const clone = item.cloneNode(true);
                wheel.appendChild(clone);
            }
        });
    }
}

// Gestion de l'ouverture/fermeture du modal
function openWheelModal() {
    const modal = document.getElementById("wheel-modal");
    modal.style.display = "block";
    generateWheelItems();
    resetWheelPosition();
}

function closeWheelModal() {
    const modal = document.getElementById("wheel-modal");
    modal.style.display = "none";
    
    if (isSpinning) {
        isSpinning = false;
        cancelAnimationFrame(wheelAnimation);
        const centerMarker = document.querySelector(".center-marker");
        if (centerMarker) {
            centerMarker.style.animation = "none";
        }
        const spinBtn = document.querySelector(".spin-btn");
        if (spinBtn) {
            spinBtn.disabled = false;
        }
    }
}

// Réinitialisation de la position de la roue
function resetWheelPosition() {
    const wheel = document.querySelector(".dofus-wheel");
    wheel.style.transition = "none";
    wheel.style.transform = "translateX(0)";
}

// Sélection aléatoire d'une récompense basée sur les probabilités
function selectRandomReward() {
    const totalProbability = rewards.reduce((sum, reward) => sum + reward.probability, 0);
    const random = Math.random() * totalProbability;
    
    let accumulatedProbability = 0;
    for (let reward of rewards) {
        accumulatedProbability += reward.probability;
        if (random <= accumulatedProbability) {
            return reward;
        }
    }
    
    return rewards[0];
}

// Affichage des notifications
function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;
    
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function showRewardPopup(reward) {
    const toast = document.createElement("div");
    toast.className = "toast wheel-toast";
    toast.innerHTML = `
        <h3>Félicitations !</h3>
        <p>Vous avez gagné : <strong>${reward.name}</strong></p>
        <p>Valeur : <span style="color: #8bc34a;">${formatNumber(reward.kamas)} kamas</span></p>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Fonction principale pour faire tourner la roue
function spinWheel() {
    if (isSpinning) return;

    if (parsedKamas < currentSpinCost) {
        showToast(`Vous n'avez pas assez de kamas (${formatNumber(Math.round(currentSpinCost))} requis) pour lancer la roue !`);
        return;
    }

    parsedKamas -= currentSpinCost;
    elements.kamas.innerHTML = formatNumber(Math.round(parsedKamas));
    isSpinning = true;
    spinCount++;

    // Augmentation du prix pour le prochain tour
    currentSpinCost = Math.round(currentSpinCost * spinCostMultiplier);
    updateSpinButtonText();

    const wheel = document.querySelector(".dofus-wheel");
    const spinBtn = document.querySelector(".spin-btn");
    const centerMarker = document.querySelector(".center-marker");

    spinBtn.disabled = true;
    centerMarker.style.animation = "pulse 0.3s infinite";

    smoothSpinWheel(wheel, spinBtn, centerMarker);
}

// Animation fluide de la roue
function smoothSpinWheel(wheel, spinBtn, centerMarker) {
    const duration = 6000;
    const startTime = Date.now();
    const spinDistance = 8000 + Math.floor(Math.random() * 4000); 

    function update() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const easedProgress = easeOutCubic(progress); 
            const currentPos = easedProgress * spinDistance;
            wheel.style.transform = `translateX(-${currentPos}px)`;
            wheelAnimation = requestAnimationFrame(update);
        } else {
            wheel.style.transition = "transform 0.5s ease-out";
            wheel.style.transform = `translateX(-${spinDistance}px)`;
            
            setTimeout(() => {
                detectCenterReward(wheel, spinBtn, centerMarker);
            }, 600);
        }
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    wheel.style.transition = "none";
    update();
}

// Détection de la récompense gagnante
function detectCenterReward(wheel, spinBtn, centerMarker) {
    const markerRect = centerMarker.getBoundingClientRect();
    const markerCenter = markerRect.left + markerRect.width / 2;

    let closestItem = null;
    let smallestDistance = Infinity;

    document.querySelectorAll('.dofus-item').forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - markerCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestItem = item;
        }
    });

    if (closestItem) {
        const rewardId = parseInt(closestItem.dataset.id);
        const reward = rewards.find(r => r.id === rewardId);
        finishSpin(reward, spinBtn, centerMarker);
        highlightWinningItem(closestItem);
    } else {
        const randomReward = selectRandomReward();
        finishSpin(randomReward, spinBtn, centerMarker);
    }
}

// Mise en valeur de l'élément gagnant
function highlightWinningItem(item) {
    item.style.transform = "scale(1.2)";
    item.style.boxShadow = "0 0 20px gold";
    item.style.transition = "all 0.3s ease";
    
    setTimeout(() => {
        item.style.transform = "scale(1)";
        item.style.boxShadow = "none";
    }, 3000);
}

// Finalisation du spin
function finishSpin(reward, spinBtn, centerMarker) {
    isSpinning = false;
    spinBtn.disabled = false;
    centerMarker.style.animation = "none";
    cancelAnimationFrame(wheelAnimation);
    
    parsedKamas += reward.kamas;
    elements.kamas.innerHTML = formatNumber(Math.round(parsedKamas));
    showRewardPopup(reward);
    
    setTimeout(() => {
        resetWheelPosition();
        generateWheelItems();
    }, 3000);
}

// Réinitialisation du prix (si nécessaire)
function resetSpinCost() {
    currentSpinCost = baseSpinCost;
    updateSpinButtonText();
}

// Initialisation au chargement
window.addEventListener("DOMContentLoaded", () => {
    generateWheelItems();
    
    if (!document.querySelector(".spin-wheel-btn")) {
        const leftPanel = document.querySelector(".left-panel");
        if (leftPanel) {
            const btn = document.createElement("button");
            btn.className = "spin-wheel-btn";
            btn.onclick = openWheelModal;
            btn.innerHTML = `<img src="./public/assets/buttonwheel.png" alt="Roulette" width="250px" height="250px">`;
            leftPanel.appendChild(btn);
        }
    }
});