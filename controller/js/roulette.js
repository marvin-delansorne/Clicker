// Configuration des récompenses
const rewards = [
    { image: "dofus-red.png", name: "Dofus Rouge", rarity: "common", probability: 0.4 },
    { image: "dofus-blue.png", name: "Dofus Bleu", rarity: "common", probability: 0.4 },
    { image: "dofus-green.png", name: "Dofus Vert", rarity: "uncommon", probability: 0.3 },
    { image: "dofus-yellow.png", name: "Dofus Jaune", rarity: "uncommon", probability: 0.3 },
    { image: "dofus-white.png", name: "Dofus Blanc", rarity: "rare", probability: 0.15 },
    { image: "dofus-black.png", name: "Dofus Noir", rarity: "rare", probability: 0.15 },
    { image: "dofus-ivory.png", name: "Dofus Ivoire", rarity: "epic", probability: 0.1 },
    { image: "dofus-ebony.png", name: "Dofus Ebène", rarity: "epic", probability: 0.1 },
    { image: "dofus-emerald.png", name: "Dofus Émeraude", rarity: "legendary", probability: 0.05 },
    { image: "dofus-ruby.png", name: "Dofus Rubis", rarity: "legendary", probability: 0.05 },
    { image: "dofus-ultimate.png", name: "Dofus Ultime", rarity: "mythic", probability: 0.01 }
  ];
  
  // Variables globales
  let isSpinning = false;
  let currentRewardIndex = 0;
  
  // Initialisation
  document.addEventListener('DOMContentLoaded', function() {
    // Bouton coffre
    const chestButton = document.getElementById('chest-button');
    const chestImg = document.getElementById('chest-img');
    
    // Popup roulette
    const roulettePopup = document.getElementById('roulette-popup');
    const spinButton = document.getElementById('spin-button');
    const closeButton = document.getElementById('close-button');
    const rouletteWheel = document.getElementById('roulette-wheel');
  
    // Charger les items dans la roulette
    loadRouletteItems();
  
    // Ouvrir le popup au clic sur le coffre
    chestButton.addEventListener('click', function() {
      roulettePopup.style.display = 'flex';
      chestImg.src = 'public/assets/chest-open.png';
    });
  
    // Fermer le popup
    closeButton.addEventListener('click', function() {
      roulettePopup.style.display = 'none';
      chestImg.src = 'public/assets/chest-closed.png';
    });
  
    // Lancer la roulette
    spinButton.addEventListener('click', spinRoulette);
  });
  
  function loadRouletteItems() {
    const rouletteWheel = document.getElementById('roulette-wheel');
    rouletteWheel.innerHTML = '';
  
    // Dupliquer les items pour une meilleure animation
    const itemsToShow = [...rewards, ...rewards, ...rewards];
  
    itemsToShow.forEach((reward, index) => {
      const item = document.createElement('div');
      item.className = 'roulette-item';
      item.dataset.index = index % rewards.length;
      
      item.innerHTML = `
        <img src="public/assets/${reward.image}" alt="${reward.name}">
        <p>${reward.name}</p>
      `;
      
      rouletteWheel.appendChild(item);
    });
  }
  
  function spinRoulette() {
    if (isSpinning) return;
    
    // Vérifier les kamas
    if (currentKamas < 1000) {
      alert("Pas assez de kamas !");
      return;
    }
  
    const rouletteWheel = document.getElementById('roulette-wheel');
    const spinButton = document.getElementById('spin-button');
    
    isSpinning = true;
    spinButton.disabled = true;
  
    // Dépenser les kamas
    currentKamas -= 1000;
    updateKamasDisplay();
  
    // Choisir une récompense aléatoire selon les probabilités
    const random = Math.random();
    let cumulativeProb = 0;
    let selectedIndex = 0;
  
    for (let i = 0; i < rewards.length; i++) {
      cumulativeProb += rewards[i].probability;
      if (random <= cumulativeProb) {
        selectedIndex = i;
        break;
      }
    }
  
    // Calculer la position dans la roulette (au milieu de la 2ème occurrence)
    const targetPosition = (rewards.length * 150) + (selectedIndex * 150) + 75;
    
    // Animation
    rouletteWheel.style.transition = 'none';
    rouletteWheel.style.transform = 'translateX(0)';
    
    setTimeout(() => {
      rouletteWheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      rouletteWheel.style.transform = `translateX(-${targetPosition}px)`;
    }, 10);
  
    // Fin de l'animation
    setTimeout(() => {
      isSpinning = false;
      spinButton.disabled = false;
      highlightWinner(selectedIndex);
      
      // Ici vous pouvez ajouter la récompense à l'inventaire
      // addToInventory(rewards[selectedIndex]);
      
      // Animation du coffre
      const chestImg = document.getElementById('chest-img');
      chestImg.src = 'public/assets/chest-open-glow.png';
      setTimeout(() => {
        chestImg.src = 'public/assets/chest-open.png';
      }, 1000);
    }, 3500);
  }
  
  function highlightWinner(index) {
    const items = document.querySelectorAll('.roulette-item');
    items.forEach(item => item.classList.remove('winner-highlight'));
    
    // Mettre en évidence toutes les occurrences de l'item gagnant
    document.querySelectorAll(`.roulette-item[data-index="${index}"]`).forEach(item => {
      item.classList.add('winner-highlight');
    });
  }