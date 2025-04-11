let parsedKamas = 0;
let kpc = 1;
let kps = 0;

const elements = {
    kamas: document.querySelector('.kamas-cost'),
    kpcText: document.getElementById('kpc-text'),
    kpsText: document.getElementById('kps-text'),
    kamaImgContainer: document.querySelector('.kama-img-container')
};

const upgrades = [
    {
        name: 'clicker',
        costElement: document.querySelector('.clicker-cost'),
        increaseElement: document.querySelector('.clicker-increase'),
        levelElement: document.querySelector('.clicker-level'),
        baseCost: 10,
        baseIncrease: 1,
        kamaMultiplier: 1.025,
        costMultiplier: 1.115,
        affects: 'kpc',
        level: 0
    },
    {
        name: 'snouffle',
        costElement: document.querySelector('.snouffle-cost'),
        increaseElement: document.querySelector('.snouffle-increase'),
        levelElement: document.querySelector('.snouffle-level'),
        baseCost: 130,
        baseIncrease: 4,
        kamaMultiplier: 1.03,
        costMultiplier: 1.12,
        affects: 'kps',
        level: 0
    },
    {
        name: 'moumoune',
        costElement: document.querySelector('.moumoune-cost'),
        increaseElement: document.querySelector('.moumoune-increase'),
        levelElement: document.querySelector('.moumoune-level'),
        baseCost: 850,
        baseIncrease: 24,
        kamaMultiplier: 1.035,
        costMultiplier: 1.11,
        affects: 'kps',
        level: 0
    },
    {
        name: 'phortiche',
        costElement: document.querySelector('.phortiche-cost'),
        increaseElement: document.querySelector('.phortiche-increase'),
        levelElement: document.querySelector('.phortiche-level'),
        baseCost: 4950,
        baseIncrease: 82,
        kamaMultiplier: 1.04,
        costMultiplier: 1.10,
        affects: 'kps',
        level: 0
    }
];

upgrades.forEach(upgrade => {
    upgrade.cost = upgrade.baseCost;
    upgrade.increase = upgrade.baseIncrease;
    updateUpgradeDisplay(upgrade);
});

function incrementKamas(e) {
    parsedKamas += kpc;
    elements.kamas.innerHTML = Math.round(parsedKamas);

    const x = e.offsetX;
    const y = e.offsetY - 20;
    const div = document.createElement('div');
    div.innerHTML = `+${Math.round(kpc)}`;
    div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 25px; pointer-events: none;`;
    elements.kamaImgContainer.appendChild(div);
    div.classList.add('fade-up');
    setTimeout(() => div.remove(), 800);

    new Audio("./public/assets/sound/mixkit-coins-handling-1939.wav").play().catch(console.warn);
    createParticles(e.clientX, e.clientY);
}

function buyUpgrade(upgradeName) {
    const upgrade = upgrades.find(u => u.name === upgradeName);
    if (!upgrade || parsedKamas < upgrade.cost) return;
    
    if (upgrade.level >= 100) {
        alert("Niveau maximum atteint (100) pour cet upgrade !");
        return;
    }

    parsedKamas -= upgrade.cost;
    elements.kamas.innerHTML = Math.round(parsedKamas);

    upgrade.level += 1;
    upgrade.increase = parseFloat((upgrade.increase * upgrade.kamaMultiplier).toFixed(2));
    upgrade.cost = Math.round(upgrade.cost * upgrade.costMultiplier);

    if (upgrade.affects === 'kpc') {
        kpc += upgrade.baseIncrease;
    } else {
        kps += upgrade.baseIncrease;
    }

    updateUpgradeDisplay(upgrade);
}

function updateUpgradeDisplay(upgrade) {
    upgrade.costElement.innerHTML = upgrade.level >= 100 ? "MAX" : Math.round(upgrade.cost);
    upgrade.increaseElement.innerHTML = upgrade.increase;
    upgrade.levelElement.innerHTML = upgrade.level;
    
    const shopItem = upgrade.costElement.closest('.shop-item');
    if (shopItem) {
        if (upgrade.level >= 100) {
            shopItem.classList.add('max-level');
            shopItem.onclick = null;
        } else {
            shopItem.classList.remove('max-level');
            shopItem.onclick = () => buyUpgrade(upgrade.name);
        }
    }
}

function createParticles(x, y) {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('img');
        particle.src = i % 2 === 0 ? './public/assets/Kama.webp' : './public/assets/kama.webp';
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = Math.random() * 2 * Math.PI;
        const distance = 60 + Math.random() * 40;
        particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

setInterval(() => {
    parsedKamas += kps / 10;
    elements.kamas.innerHTML = Math.round(parsedKamas);
    elements.kpcText.innerHTML = Math.round(kpc);
    elements.kpsText.innerHTML = Math.round(kps);
    checkForResetButton();
}, 100);

// Sauvegarde l'état du jeu dans le localStorage
function saveGameState() {
    const gameState = {
        parsedKamas,
        kpc,
        kps,
        upgrades: upgrades.map(upgrade => ({
            name: upgrade.name,
            level: upgrade.level,
            cost: upgrade.cost,
            increase: upgrade.increase
        }))
    };

    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log("État du jeu sauvegardé :", gameState);
}

// Charge l'état du jeu depuis le localStorage
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (!savedState) return;

    const gameState = JSON.parse(savedState);
    console.log("État du jeu chargé :", gameState);

    parsedKamas = gameState.parsedKamas || 0;
    kpc = gameState.kpc || 1;
    kps = gameState.kps || 0;

    gameState.upgrades.forEach(savedUpgrade => {
        const upgrade = upgrades.find(u => u.name === savedUpgrade.name);
        if (upgrade) {
            upgrade.level = savedUpgrade.level;
            upgrade.cost = savedUpgrade.cost;
            upgrade.increase = savedUpgrade.increase;
        }
    });

    upgrades.forEach(updateUpgradeDisplay);
    elements.kamas.innerHTML = Math.round(parsedKamas);
    elements.kpcText.innerHTML = Math.round(kpc);
    elements.kpsText.innerHTML = Math.round(kps);
}

// Sauvegarde automatique toutes les 10 secondes
setInterval(saveGameState, 10000);

// Sauvegarde lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    saveGameState();
    saveAchievements();
    saveWheelState();
});

// Chargement des données au démarrage
window.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    loadAchievements();
    loadWheelState();
});

// Vérifie si le bouton de réinitialisation doit être affiché
function checkForResetButton() {
    const resetContainer = document.querySelector('.reset-container');
    if (parsedKamas >= 10) {
        resetContainer.style.display = 'block'; // Affiche le bouton
    } else {
        resetContainer.style.display = 'none'; // Cache le bouton
    }
}

// Réinitialise la partie
function resetGame() {
    if (!confirm("Êtes-vous sûr de vouloir réinitialiser la partie ? Cette action est irréversible.")) {
        return;
    }

    // Réinitialise les variables principales
    parsedKamas = 5000000;
    kpc = 1;
    kps = 0;

    // Réinitialise les upgrades
    upgrades.forEach(upgrade => {
        upgrade.level = 0;
        upgrade.cost = upgrade.baseCost;
        upgrade.increase = upgrade.baseIncrease;
        updateUpgradeDisplay(upgrade);
    });

    // Met à jour l'affichage
    elements.kamas.innerHTML = Math.round(parsedKamas);
    elements.kpcText.innerHTML = Math.round(kpc);
    elements.kpsText.innerHTML = Math.round(kps);

    // Cache le bouton de reset
    const resetContainer = document.querySelector('.reset-container');
    resetContainer.style.display = 'none';

    // Supprime les données du localStorage
    localStorage.removeItem('gameState');
    localStorage.removeItem('achievementsState');
    localStorage.removeItem('wheelState');

    console.log("Partie réinitialisée !");
}