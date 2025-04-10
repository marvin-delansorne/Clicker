const achievements = [
    {
        id: 'first_click',
        name: 'Premier clic!',
        description: 'Effectuez votre premier clic sur le kama',
        condition: (gameState) => gameState.totalClicks >= 1,
        unlocked: false,
        reward: 10
    },
    {
        id: 'clicker_10',
        name: 'Clicomaniaque',
        description: 'Effectuez 10 clics',
        condition: (gameState) => gameState.totalClicks >= 10,
        unlocked: false,
        reward: 50
    },
    {
        id: 'clicker_100',
        name: 'Clic frénétique',
        description: 'Effectuez 100 clics',
        condition: (gameState) => gameState.totalClicks >= 100,
        unlocked: false,
        reward: 200
    },
    {
        id: 'clicker_1000',
        name: 'Maître du clic',
        description: 'Effectuez 1000 clics',
        condition: (gameState) => gameState.totalClicks >= 1000,
        unlocked: false,
        reward: 1000
    },
    {
        id: 'first_upgrade',
        name: 'Premier achat',
        description: 'Achetez votre premier upgrade',
        condition: (gameState) => gameState.totalUpgrades >= 1,
        unlocked: false,
        reward: 100
    },
    {
        id: 'upgrade_10',
        name: 'Collectionneur',
        description: 'Achetez 10 upgrades au total',
        condition: (gameState) => gameState.totalUpgrades >= 10,
        unlocked: false,
        reward: 500
    },
    {
        id: 'millionaire',
        name: 'Millionnaire',
        description: 'Atteignez 1 million de kamas',
        condition: (gameState) => gameState.parsedKamas >= 1000000,
        unlocked: false,
        reward: 5000
    },
    {
        id: 'billionaire',
        name: 'Milliardaire',
        description: 'Atteignez 1 milliard de kamas',
        condition: (gameState) => gameState.parsedKamas >= 1000000000,
        unlocked: false,
        reward: 100000
    },
    {
        id: 'kps_100',
        name: 'Rentier',
        description: 'Atteignez 100 kamas par seconde',
        condition: (gameState) => gameState.kps >= 100,
        unlocked: false,
        reward: 1000
    },
    {
        id: 'kps_1000',
        name: 'Producteur de masse',
        description: 'Atteignez 1000 kamas par seconde',
        condition: (gameState) => gameState.kps >= 1000,
        unlocked: false,
        reward: 5000
    },
    {
        id: 'max_upgrade',
        name: 'Perfectionniste',
        description: 'Maximisez un upgrade au niveau 100',
        condition: (gameState) => gameState.hasMaxedUpgrade,
        unlocked: false,
        reward: 10000
    },
    {
        id: 'all_max_upgrades',
        name: 'Ultimate Perfectionniste',
        description: 'Maximisez tous les upgrades au niveau 100',
        condition: (gameState) => gameState.allUpgradesMaxed,
        unlocked: false,
        reward: 100000
    }
];

const gameState = {
    totalClicks: 0,
    totalUpgrades: 0,
    parsedKamas: 0,
    kps: 0,
    hasMaxedUpgrade: false,
    allUpgradesMaxed: false,
    unlockedAchievements: [],
    achievementsVisible: false
};

function initAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = `
        <div class="achievements-title" onclick="toggleAchievements()">Succès</div>
        <div class="achievements-list" id="achievements-list" style="display: none;"></div>
    `;
    
    updateAchievementsDisplay();
}

function toggleAchievements() {
    gameState.achievementsVisible = !gameState.achievementsVisible;
    const list = document.getElementById('achievements-list');
    if (list) {
        list.style.display = gameState.achievementsVisible ? 'block' : 'none';
    }
}

function checkAchievements() {
    console.log("checkAchievements appelé, parsedKamas :", parsedKamas);
    gameState.parsedKamas = parsedKamas;
    gameState.kps = kps;
    gameState.hasMaxedUpgrade = upgrades.some(u => u.level >= 100);
    gameState.allUpgradesMaxed = upgrades.every(u => u.level >= 100);
    
    let newAchievements = false;
    
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition(gameState)) {
            achievement.unlocked = true;
            gameState.unlockedAchievements.push(achievement);
            parsedKamas += achievement.reward;
            elements.kamas.innerHTML = Math.round(parsedKamas);
            newAchievements = true;
            
            showAchievementNotification(achievement);
        }
    });
    
    if (newAchievements) {
        updateAchievementsDisplay();
        saveAchievements();
    }
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <span class="achievement-icon">🏆</span>
            <div>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <p class="reward">+${achievement.reward} kamas!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function updateAchievementsDisplay() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    
    list.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? 
                    `<p class="achievement-reward">Récompense: +${achievement.reward} kamas</p>` : 
                    '<p class="achievement-progress">En cours...</p>'}
            </div>
        </div>
    `).join('');
}

// Sauvegarde les succès dans le localStorage
function saveAchievements() {
    const achievementsState = achievements.map(achievement => ({
        id: achievement.id,
        unlocked: achievement.unlocked
    }));

    localStorage.setItem('achievementsState', JSON.stringify(achievementsState));
    console.log("Succès sauvegardés :", achievementsState);
}

// Charge les succès depuis le localStorage
function loadAchievements() {
    const savedAchievements = localStorage.getItem('achievementsState');
    if (!savedAchievements) return;

    const achievementsState = JSON.parse(savedAchievements);
    achievementsState.forEach(savedAchievement => {
        const achievement = achievements.find(a => a.id === savedAchievement.id);
        if (achievement) {
            achievement.unlocked = savedAchievement.unlocked;
        }
    });

    updateAchievementsDisplay();
    console.log("Succès chargés :", achievementsState);
}

const originalIncrementKamas = incrementKamas;
incrementKamas = function(e) {
    originalIncrementKamas(e);
    gameState.totalClicks++;
    checkAchievements();
};

const originalBuyUpgrade = buyUpgrade;
buyUpgrade = function(upgradeName) {
    originalBuyUpgrade(upgradeName);
    gameState.totalUpgrades++;
    checkAchievements();
};

setInterval(checkAchievements, 1000);

window.addEventListener('DOMContentLoaded', () => {
    initAchievements();
    loadAchievements();
});