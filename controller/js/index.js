let parsedKamas = 90000000;
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
}, 100);