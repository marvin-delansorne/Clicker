document.addEventListener("DOMContentLoaded", () => {
    fetch("/Clicker/public/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données JSON");
            }
            return response.json();
        })
        .then(data => {
            // console.log("Données chargées :", data);

            const charContainer = document.getElementById("charContainer");

            charContainer.innerHTML = "";

            data.personnage.forEach((personnage, index) => {
                const charDiv = document.createElement("div");
                charDiv.setAttribute("class", "charDiv");
                charDiv.setAttribute("data-nom", personnage.nom);
                charContainer.appendChild(charDiv);
                
                const charLvl = document.createElement("div");
                charLvl.setAttribute("id", "charLvl");
                charLvl.setAttribute("class", "")
                charDiv.appendChild(charLvl)

                        const charLvlSpan = document.createElement("span");
                        charLvlSpan.setAttribute("id", "charLvlSpan")
                        if(personnage.level === 0) {
                            charLvl.classList.add("charLvl-hidden");
                        } else {
                            charLvl.classList.remove("charLvl-hidden");
                            charLvl.classList.add("charLvl-visible");
                        }
                        charLvlSpan.textContent = "lvl";
                        charLvl.appendChild(charLvlSpan)

                        const charLvlLvl = document.createElement("p");
                        charLvlLvl.textContent = personnage.level;
                        charLvl.appendChild(charLvlLvl)

                    const charImg = document.createElement("img");
                    charImg.setAttribute("id", "charImg")
                    if(personnage.level === 0) {
                        charImg.classList.add("charImg-locked")
                    } else {
                        charImg.classList.remove("charImg-locked")
                        charImg.classList.add("charImg-unlocked")
                    }
                    charImg.src = personnage.image;
                    charImg.alt = personnage.nom;
                    charDiv.appendChild(charImg);

                    const charPriceDiv = document.createElement("div");
                    charPriceDiv.setAttribute("id", "charPriceDiv")
                    charDiv.appendChild(charPriceDiv);

                    const charPrice = document.createElement("span");
                    charPrice.setAttribute("id", "charPriceSpan");
                    charPrice.textContent = personnage.baseCost;
                    charPriceDiv.appendChild(charPrice);

                    const charKama = document.createElement("img");
                    charKama.src = "/Clicker/public/assets/kama.png";
                    charPriceDiv.appendChild(charKama);

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
                        
                            // Mettre à jour les coûts des personnages
                            data.personnage.forEach(perso => {
                                perso.baseCost = Math.round(perso.baseCost * (1 - reduction));
                                const charDiv = document.querySelector(`.charDiv[data-nom="${perso.nom}"]`);
                                if (charDiv) {
                                    const charPrice = charDiv.querySelector("#charPriceSpan");
                                    if (charPrice) {
                                        charPrice.textContent = perso.baseCost; // Met à jour le prix affiché
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
                                if (upgrade.level < 100) { // Vérifie que le niveau n'est pas déjà au maximum
                                    upgrade.level += 1;
                                    upgrade.increase = parseFloat((upgrade.increase * upgrade.kamaMultiplier).toFixed(2));
                                    upgrade.cost = Math.round(upgrade.cost * upgrade.costMultiplier);
                                    updateUpgradeDisplay(upgrade); // Met à jour l'affichage

                                    // Met à jour kps ou kpc en fonction de l'upgrade
                                    if (upgrade.affects === 'kps') {
                                        kps += upgrade.baseIncrease;
                                    } else if (upgrade.affects === 'kpc') {
                                        kpc += upgrade.baseIncrease;
                                    }
                                }
                            });

                            // Met à jour l'affichage des valeurs kps et kpc
                            elements.kpsText.innerHTML = Math.round(kps);
                            elements.kpcText.innerHTML = Math.round(kpc);
                        }
                    }
                    
                    function buyCharacter(personnage, charLvlLvl, charPrice) {
                        if (parsedKamas < personnage.baseCost) {
                            alert("Vous n'avez pas assez de kamas !");
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
                    
                        // Mettre à jour l'affichage (lvl au dessus du perso + prix en dessous)
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
                    
                        saveGameState(); // Sauvegarde après achat
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
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
});

