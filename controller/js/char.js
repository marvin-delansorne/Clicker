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

            const charContainer = document.getElementById("charContainer"); // Conteneur pour les personnages

            charContainer.innerHTML = "";

            data.personnage.forEach(personnage => {
                const charDiv = document.createElement("div");
                charDiv.setAttribute("class", "charDiv");
                charContainer.appendChild(charDiv);
                
                const charLvl = document.createElement("div");
                charLvl.setAttribute("id", "charLvl");
                charLvl.setAttribute("class", "")
                if(personnage.level) {
                    charLvl.classList.add("charLvl-hidden")
                }
                charDiv.appendChild(charLvl)

                        const charLvlSpan = document.createElement("span");
                        charLvlSpan.setAttribute("id", "charLvlSpan")
                        charLvlSpan.textContent = "lvl";
                        charLvl.appendChild(charLvlSpan)

                        const charLvlLvl = document.createElement("p");
                        charLvlLvl.textContent = personnage.level;
                        charLvl.appendChild(charLvlLvl)

                    const charImg = document.createElement("img");
                    charImg.setAttribute("id", "charImg")
                    charImg.src = personnage.image;
                    charImg.alt = personnage.nom;
                    charDiv.appendChild(charImg);

                    const charPrice = document.createElement("span");
                    charPrice.setAttribute("class", "charPriceSpan");
                    charPrice.textContent = personnage.baseCost;
                    charDiv.appendChild(charPrice);

                    const charKama = document.createElement("img");
                    charKama.src = "/Clicker/public/assets/kama.png";
                    charPrice.appendChild(charKama);


                // console.log(`Personnage ajouté : ${personnage.nom}, Image : ${personnage.image}`);
            });
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
});