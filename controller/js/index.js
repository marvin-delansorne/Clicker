let kamas = document.querySelector('.kamas-cost');
let parsedKamas = parseFloat(kamas.innerHTML);
let clickerCost = document.querySelector('.clicker-cost');
let parsedClickerCost = parseFloat(clickerCost.innerHTML);
let clickerLevel = document.querySelector('.clicker-level');
let clickerIncrease = document.querySelector('.clicker-increase');
let parsedClickerIncrease = parseFloat(clickerIncrease.innerHTML);

let snouffle = document.querySelector('.snouffle-cost');
let parsedSnouffleCost = parseFloat(snouffle.innerHTML);
let snouffleLevel = document.querySelector('.snouffle-level');
let snouffleIncrease = document.querySelector('.snouffle-increase');
let parsedSnouffleIncrease = parseFloat(snouffleIncrease.innerHTML);

let moumoune = document.querySelector('.moumoune-cost');
let parsedMoumouneCost = parseFloat(moumoune.innerHTML);
let moumouneLevel = document.querySelector('.moumoune-level');
let moumouneIncrease = document.querySelector('.moumoune-increase');
let parsedMoumouneIncrease = parseFloat(moumouneIncrease.innerHTML);

let phortiche = document.querySelector('.phortiche-cost');
let parsedPhorticheCost = parseFloat(phortiche.innerHTML);
let phorticheLevel = document.querySelector('.phortiche-level');
let phorticheIncrease = document.querySelector('.phortiche-increase');
let parsedPhorticheIncrease = parseFloat(phorticheIncrease.innerHTML);

let kpcText = document.getElementById('kpc-text');
let kpsText = document.getElementById('kps-text');

let kpc = 1;
let kps = 0;

function incrementKamas(e) {
    kamas.innerHTML = Math.round(parsedKamas += kpc);
    let audio = new Audio("mixkit-coins-handling-1939.wav");
    audio.play().catch(e => console.warn("Erreur de lecture audio :", e));

    // Récupération de la position du clic
    createParticles(e.clientX, e.clientY);
}

function createParticles(x, y) {
    const container = document.getElementById('particle-container');
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('img');
        particle.src = i % 2 === 0 ? '../assets/kamas.webp' : '../assets/Kamas.png';
        particle.classList.add('particle');

        // Position initiale au point de clic exact
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Déplacement aléatoire
        const angle = Math.random() * 2 * Math.PI;
        const distance = 60 + Math.random() * 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.setProperty('--x', `${dx}px`);
        particle.style.setProperty('--y', `${dy}px`);

        container.appendChild(particle);

        // Supprimer après l'animation
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

function buyClicker() {
    if (parsedKamas >= parsedClickerCost) {
        kamas.innerHTML = Math.round(parsedKamas -= parsedClickerCost);

        clickerLevel.innerHTML++;
        parsedClickerIncrease = parseFloat((parsedClickerIncrease * 1.3).toFixed(2));
        clickerIncrease.innerHTML = parsedClickerIncrease;
        kpc += parsedClickerIncrease;

        parsedClickerCost *= 1.18;
        clickerCost.innerHTML = Math.round(parsedClickerCost);
    }
}

function buySnouffle() {
    if (parsedKamas >= parsedSnouffleCost) {
        kamas.innerHTML = Math.round(parsedKamas -= parsedSnouffleCost);

        snouffleLevel.innerHTML++;
        parsedSnouffleIncrease = parseFloat((parsedSnouffleIncrease * 1.3).toFixed(2));
        snouffleIncrease.innerHTML = parsedSnouffleIncrease;
        kps += parsedSnouffleIncrease;

        parsedSnouffleCost *= 1.18;
        snouffle.innerHTML = Math.round(parsedSnouffleCost);
    }
}

function buyMoumoune() {
    if (parsedKamas >= parsedMoumouneCost) {
        kamas.innerHTML = Math.round(parsedKamas -= parsedMoumouneCost);

        moumouneLevel.innerHTML++;
        parsedMoumouneIncrease = parseFloat((parsedMoumouneIncrease * 1.3).toFixed(2));
        moumouneIncrease.innerHTML = parsedMoumouneIncrease;
        kps += parsedMoumouneIncrease;

        parsedMoumouneCost *= 1.18;
        moumoune.innerHTML = Math.round(parsedMoumouneCost);
    }
}

function buyPhortiche() {
    if (parsedKamas >= parsedPhorticheCost) {
        kamas.innerHTML = Math.round(parsedKamas -= parsedPhorticheCost);

        phorticheLevel.innerHTML++;
        parsedPhorticheIncrease = parseFloat((parsedPhorticheIncrease * 1.3).toFixed(2));
        phorticheIncrease.innerHTML = parsedPhorticheIncrease;
        kps += parsedPhorticheIncrease;

        parsedPhorticheCost *= 1.18;
        phortiche.innerHTML = Math.round(parsedPhorticheCost);
    }
}

setInterval(() => {
    parsedKamas += kps / 10;
    kamas.innerHTML = Math.round(parsedKamas);
    kpcText.innerHTML = Math.round(kpc);
    kpsText.innerHTML = Math.round(kps);
}, 100);