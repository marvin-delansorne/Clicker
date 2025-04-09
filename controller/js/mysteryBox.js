// Configuration des récompenses
const rewards = [
    { id: 1, image: "./public/assets/dofusemeraude.png", name: "Dofus Emeraude", rarity: "legendary", probability: 0.05, kamas: 1000000, weight: 1 },
    { id: 2, image: "./public/assets/dofusocre.png", name: "Dofus Ocre", rarity: "common", probability: 0.3, kamas: 50000, weight: 6 },
    { id: 3, image: "./public/assets/dofuspourpre.png", name: "Dofus Pourpre", rarity: "uncommon", probability: 0.25, kamas: 100000, weight: 4 },
    { id: 4, image: "./public/assets/dofusivoire.png", name: "Dofus Ivoire", rarity: "epic", probability: 0.15, kamas: 500000, weight: 2 },
    { id: 5, image: "./public/assets/dofusebene.png", name: "Dofus Ebène", rarity: "epic", probability: 0.15, kamas: 500000, weight: 2 },
    { id: 6, image: "./public/assets/dofusturquoise.png", name: "Dofus Turquoise", rarity: "rare", probability: 0.1, kamas: 250000, weight: 3 }
];

let isSpinning = false;
let wheelAnimation = null;
let selectedReward = null;
const itemWidth = 160; // Largeur fixe d'un item + marge

// Fonction pour trouver l'item sous le marqueur
function getItemUnderMarker() {
    const wheel = document.querySelector(".dofus-wheel");
    const wheelRect = wheel.getBoundingClientRect();
    const centerX = wheelRect.left + wheelRect.width / 2;
    
    const items = Array.from(document.querySelectorAll(".dofus-item"));
    for (let item of items) {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.left <= centerX && itemRect.right >= centerX) {
            return item;
        }
    }
    return null;
}

// Fonction pour faire tourner la roue
function spinWheel() {
    if (isSpinning) return;
    
    const spinCost = 50000;
    if (parsedKamas < spinCost) {
        showToast("Vous n'avez pas assez de kamas (50 000 requis) pour lancer la roue !");
        return;
    }

    parsedKamas -= spinCost;
    elements.kamas.innerHTML = Math.round(parsedKamas);
    isSpinning = true;
    
    const wheel = document.querySelector(".dofus-wheel");
    const spinBtn = document.querySelector(".spin-btn");
    const centerMarker = document.querySelector(".center-marker");
    
    spinBtn.disabled = true;
    centerMarker.style.animation = "pulse 0.5s infinite";

    // Sélection aléatoire de la récompense
    selectedReward = selectRandomReward();
    
    // Trouver tous les items correspondants
    const allItems = Array.from(document.querySelectorAll(".dofus-item"));
    const targetItems = allItems.filter(item => item.dataset.id == selectedReward.id);
    
    if (targetItems.length === 0) {
        resetSpinState();
        showToast("Erreur lors de la rotation. Veuillez réessayer.");
        return;
    }
    
    // Choisir un item dans la première copie de la roue
    const targetItem = targetItems.find(item => {
        const index = allItems.indexOf(item);
        return index < allItems.length / 5;
    }) || targetItems[0];
    
    // Calcul de la position d'arrêt pour centrer l'item
    const wheelRect = wheel.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();
    const stopPosition = (itemRect.left - wheelRect.left) + (itemWidth / 2) - (wheelRect.width / 2);
    
    // Animation
    animateWheel(wheel, stopPosition, spinBtn, centerMarker);
}

// Nouvelle fonction d'animation
function animateWheel(wheel, stopPosition, spinBtn, centerMarker) {
    const duration = 6000; // 6 secondes
    const startTime = Date.now();
    const spinDistance = 8000 + stopPosition; // Distance totale
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Courbe d'animation personnalisée
        let easing;
        if (progress < 0.7) {
            easing = easeOutQuad(progress / 0.7);
        } else {
            easing = 0.7 + 0.3 * easeOutBack((progress - 0.7) / 0.3);
        }
        
        const currentPos = easing * spinDistance;
        wheel.style.transform = `translateX(-${currentPos}px)`;
        
        if (progress < 1) {
            wheelAnimation = requestAnimationFrame(update);
        } else {
            // Ajustement final précis
            wheel.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)";
            wheel.style.transform = `translateX(-${stopPosition}px)`;
            
            setTimeout(() => {
                // Récupérer l'item sous le marqueur après l'arrêt
                const winningItem = getItemUnderMarker();
                if (winningItem) {
                    const rewardId = winningItem.dataset.id;
                    const actualReward = rewards.find(r => r.id == rewardId);
                    finishSpin(actualReward, spinBtn, centerMarker);
                } else {
                    finishSpin(selectedReward, spinBtn, centerMarker);
                }
            }, 500);
        }
    }
    
    wheel.style.transition = "none";
    update();
}

// Fonction pour terminer la rotation
function finishSpin(reward, spinBtn, centerMarker) {
    isSpinning = false;
    spinBtn.disabled = false;
    centerMarker.style.animation = "none";
    cancelAnimationFrame(wheelAnimation);
    
    // Mettre à jour les kamas du joueur
    parsedKamas += reward.kamas;
    elements.kamas.innerHTML = Math.round(parsedKamas);
    
    // Afficher la récompense
    showRewardPopup(reward);
    
    // Mettre en évidence l'item gagné
    const allItems = document.querySelectorAll(`.dofus-item[data-id="${reward.id}"]`);
    allItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const wheelRect = document.querySelector(".dofus-wheel").getBoundingClientRect();
        const centerX = wheelRect.left + wheelRect.width / 2;
        
        // Seul l'item près du centre est mis en évidence
        if (Math.abs(itemRect.left + itemWidth/2 - centerX) < 20) {
            item.style.transform = "scale(1.15)";
            item.style.boxShadow = "0 0 25px gold";
            item.style.zIndex = "10";
            item.style.transition = "all 0.3s";
            
            setTimeout(() => {
                item.style.transform = "scale(1)";
                item.style.boxShadow = "none";
                item.style.zIndex = "";
            }, 3000);
        }
    });
    
    // Réinitialisation différée
    setTimeout(() => {
        resetWheelPosition();
        generateWheelItems();
    }, 3000);
}

// Fonctions d'easing supplémentaires
function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Initialisation au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    // Initialisation des variables
    if (typeof parsedKamas === 'undefined') window.parsedKamas = 100000;
    if (typeof elements === 'undefined') {
        window.elements = {
            kamas: document.querySelector(".kamas-cost") || { innerHTML: "" }
        };
    }
    
    generateWheelItems();
    
    // Ajout de l'écouteur d'événements
    const spinBtn = document.querySelector(".spin-wheel-btn");
    if (spinBtn) {
        spinBtn.addEventListener('click', openWheelModal);
    }
});

// Assurez-vous que la fonction est bien définie dans la portée globale
window.openWheelModal = function() {
    const modal = document.getElementById("wheel-modal");
    if (!modal) return;
    
    modal.style.display = "block";
    generateWheelItems();
    resetWheelPosition();
};