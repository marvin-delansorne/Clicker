document.addEventListener("DOMContentLoaded", () => {
    fetch(`/Clicker/public/data.json?version=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données JSON");
            }
            return response.json();
        })
        .then(data => {
            loadCharactersState(data);

            const charContainer = document.getElementById("charContainer");

            charContainer.innerHTML = "";

            data.personnage.forEach((personnage, index) => {
                const charDiv = document.createElement("div");
                charDiv.setAttribute("class", "charDiv");
                charDiv.setAttribute("data-nom", personnage.nom);

                // Appliquer la classe "disabled" si les conditions ne sont pas remplies
                if (
                    (personnage.nom === "Xélor" && parsedKamas < 100000) ||
                    (personnage.nom === "Huppermage" && kps < 50) ||
                    (personnage.nom === "Crâ" && upgrades.find(u => u.name === "clicker").level < 10)
                ) {
                    charDiv.classList.add("disabled");
                }

                charContainer.appendChild(charDiv);

                const charLvl = document.createElement("div");
                charLvl.setAttribute("id", "charLvl");
                charLvl.setAttribute("class", "");
                charDiv.appendChild(charLvl);

                const charLvlSpan = document.createElement("span");
                charLvlSpan.setAttribute("id", "charLvlSpan");
                if (personnage.level === 0) {
                    charLvl.classList.add("charLvl-hidden");
                } else {
                    charLvl.classList.remove("charLvl-hidden");
                    charLvl.classList.add("charLvl-visible");
                }
                charLvlSpan.textContent = "lvl";
                charLvl.appendChild(charLvlSpan);

                const charLvlLvl = document.createElement("p");
                charLvlLvl.textContent = personnage.level;
                charLvl.appendChild(charLvlLvl);

                const charImg = document.createElement("img");
                charImg.setAttribute("id", "charImg");
                if (personnage.level === 0) {
                    charImg.classList.add("charImg-locked");
                } else {
                    charImg.classList.remove("charImg-locked");
                    charImg.classList.add("charImg-unlocked");
                }
                charImg.src = personnage.image;
                charImg.alt = personnage.nom;
                charDiv.appendChild(charImg);

                const charPrice = document.createElement("span");
                charPrice.setAttribute("id", "charPriceSpan");
                charPrice.textContent = personnage.baseCost;
                charDiv.appendChild(charPrice);

                const charKama = document.createElement("img");
                charKama.src = "/Clicker/public/assets/kama.png";
                charPrice.appendChild(charKama);

                // Ajouter un bouton pour afficher les détails
                const detailsButton = document.createElement("button");
                detailsButton.textContent = "Détails";
                detailsButton.classList.add("details-button");
                detailsButton.addEventListener("click", (event) => {
                    event.stopPropagation(); // Empêche la propagation vers le conteneur parent
                    showCharacterDetails(personnage);
                });
                charDiv.appendChild(detailsButton);

                // Ajouter un événement de clic pour acheter/améliorer le personnage
                charDiv.addEventListener("click", () => buyCharacter(personnage, charLvlLvl, charPrice));

                function updateKps(amount) {
                    kps += amount;
                }
                
                function applyPassive(personnage) {
                    const effect = personnage["cara-sort"];
                    const attribute = personnage.attribut;
                    const level = personnage.level;
                
                    // passif : Pandawa
                    if (effect.includes("Réduit de")) {
                        const reduction = attribute * level / 100; // Réduction en pourcentage
                
                        upgrades.forEach(upgrade => {
                            upgrade.cost = Math.round(upgrade.cost * (1 - reduction));
                            updateUpgradeDisplay(upgrade);
                        });
                
                        data.personnage.forEach(perso => {
                            if (perso.nom !== personnage.nom) { // Exclure le Pandawa
                                perso.baseCost = Math.round(perso.baseCost * (1 - reduction));
                                const charDiv = document.querySelector(`.charDiv[data-nom="${perso.nom}"]`);
                                if (charDiv) {
                                    const charPrice = charDiv.querySelector(".charPriceSpan");
                                    if (charPrice) {
                                        charPrice.textContent = perso.baseCost;
                                    }
                                }
                            }
                        });
                    } 
                    // passif : Ecaflip
                    else if (effect.includes("chance sur deux")) {
                        console.log("Passif non implémenté : Chance d'obtenir une boîte mystère");
                    } 
                    // passif : Sacrieur
                    else if (effect.includes("Gain de")) {
                        const gainMultiplier = attribute * level / 100;
                        kps += kps * gainMultiplier;
                    } 
                    // passif : Crâ
                    else if (effect.includes("Augmente de")) {
                        const clickMultiplier = attribute * level / 100;
                        kpc += kpc * clickMultiplier;
                    } 
                    // passif : Xélor
                    else if (effect.includes("Augmente ton clic")) {
                        const clickBoost = attribute * level;
                        kpc += clickBoost;
                    } 
                    // passif : Huppermage
                    else if (effect.includes("Augmente d")) {
                        const passiveBoost = attribute * level / 100;
                        kps += kps * passiveBoost;
                    } 
                    // passif : Iop
                    else if (effect.includes("Augmente tes améliorations")) {
                        upgrades.forEach(upgrade => {
                            upgrade.level += 1;
                            upgrade.increase = parseFloat((upgrade.increase * upgrade.kamaMultiplier).toFixed(2));
                            upgrade.cost = Math.round(upgrade.cost * upgrade.costMultiplier);
                            updateUpgradeDisplay(upgrade);
                            buyUpgrade("clicker");
                            buyUpgrade("snouffle");
                            buyUpgrade("momoon");
                            buyUpgrade("phortiche");
                        });
                    }
                }
                
                function buyCharacter(personnage, charLvlLvl, charPrice) {
                    // Vérifie si le personnage est Xélor, Huppermage ou Crâ et applique des conditions spécifiques
                    if (["Xélor", "Huppermage", "Crâ"].includes(personnage.nom)) {
                        if (personnage.nom === "Xélor" && parsedKamas < 100000) {
                            alert("Vous devez avoir au moins 100 000 kamas pour débloquer Xélor !");
                            return;
                        }
                        if (personnage.nom === "Huppermage" && kps < 50) {
                            alert("Vous devez avoir au moins 50 KPS pour débloquer Huppermage !");
                            return;
                        }
                        if (personnage.nom === "Crâ" && upgrades.find(u => u.name === "clicker").level < 10) {
                            alert("Vous devez avoir amélioré le Clicker au niveau 10 pour débloquer Crâ !");
                            return;
                        }
                    }

                    if (parsedKamas < personnage.baseCost) {
                        alert("Vous n'avez pas assez de kamas !");
                        return;
                    }
                
                    if (personnage.level >= 15) {
                        alert("Niveau maximum atteint (15) !");
                        return;
                    }
                
                    // Déduire le coût des kamas
                    parsedKamas -= personnage.baseCost;
                    document.querySelector('.kamas-cost').textContent = Math.round(parsedKamas);
                
                    // Augmenter le niveau du personnage
                    personnage.level += 1;
                
                    // Mettre à jour le coût pour le prochain niveau (sauf pour Xélor et Écaflip)
                    if (personnage.nom !== "Xélor" && personnage.nom !== "Ecaflip") {
                        personnage.baseCost = Math.round(personnage.baseCost * personnage.costMultiplier);
                    }
                
                    // Appliquer le passif du personnage
                    applyPassive(personnage);
                
                    // Mettre à jour l'affichage (lvl au-dessus du perso + prix en dessous)
                    charLvlLvl.textContent = personnage.level;
                    charPrice.textContent = personnage.baseCost;
                
                    // Rendre visible le niveau si le personnage est débloqué
                    if (personnage.level > 0) {
                        const charLvl = charLvlLvl.parentElement;
                        charLvl.classList.remove("charLvl-hidden");
                        charLvl.classList.add("charLvl-visible");
                
                        // Mettre à jour la luminosité de l'image
                        const charImg = charLvl.parentElement.querySelector("#charImg");
                        charImg.classList.remove("charImg-locked");
                        charImg.classList.add("charImg-unlocked");
                    }
                
                    // Sauvegarde l'état des personnages
                    saveCharactersState(data);
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

                if (index >= 5) {
                    charPrice.classList.add("span-hidden")
                }

                // console.log(`Personnage ajouté : ${personnage.nom}, Image : ${personnage.image}`);
            });

            // Sauvegarde les niveaux des personnages dans le localStorage
            function saveCharactersState(data) {
                const charactersState = data.personnage.map(personnage => ({
                    nom: personnage.nom,
                    level: personnage.level,
                    baseCost: personnage.baseCost
                }));

                localStorage.setItem('charactersState', JSON.stringify(charactersState));
                console.log("État des personnages sauvegardé :", charactersState);
            }

            // Charge les niveaux des personnages depuis le localStorage
            function loadCharactersState(data) {
                const savedCharacters = localStorage.getItem('charactersState');
                if (!savedCharacters) return;

                const charactersState = JSON.parse(savedCharacters);
                charactersState.forEach(savedCharacter => {
                    const personnage = data.personnage.find(p => p.nom === savedCharacter.nom);
                    if (personnage) {
                        personnage.level = savedCharacter.level;
                        personnage.baseCost = savedCharacter.baseCost;
                    }
                });

                console.log("État des personnages chargé :", charactersState);
            }

            // Afficher les détails du personnage
            function showCharacterDetails(personnage) {
                const modal = document.createElement("div");
                modal.className = "character-modal";

                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                        <h3>${personnage.nom}</h3>
                        <img src="${personnage.image}" alt="${personnage.nom}" class="character-image">
                        <p><strong>Niveau :</strong> ${personnage.level}</p>
                        <p><strong>Coût de base :</strong> ${personnage.baseCost} kamas</p>
                        <p><strong>Passif :</strong> ${personnage["cara-sort"]}</p>
                    </div>
                `;

                document.body.appendChild(modal);
            }
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
});

