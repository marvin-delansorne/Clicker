document.addEventListener("DOMContentLoaded", () => {
    fetch("/Clicker/public/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données JSON");
            }
            return response.json();
        })
        .then(data => {
            const personnage = data.personnage;
            const skins = data.skins;

            function changeSkin() {
                const zobal = personnage.find(p => p.nom === "Zobal");
                if (!zobal) return;

                function updateSkin(level) {
                    const charImg = document.querySelector(".character img");
                    if (charImg) {
                        // Change de skin tous les 10 niveaux
                        const newSkinIndex = Math.floor(level / 10) % skins.length;
                        charImg.src = skins[newSkinIndex].image;
                        console.log(`Skin changé : ${skins[newSkinIndex].image}`);
                    }
                }

                document.addEventListener("click", (event) => {
                    const target = event.target.closest(".charDiv");
                    if (target && target.dataset.nom === "Zobal") {
                        const zobal = personnage.find(p => p.nom === "Zobal");
                        if (!zobal) return;

                        console.log(`parsedKamas: ${parsedKamas}, zobal.baseCost: ${zobal.baseCost}`);
                        if (parsedKamas > zobal.baseCost) {
                            parsedKamas -= zobal.baseCost; // Déduit le coût
                            zobal.level = (zobal.level || 0) + 1; // Incrémente le niveau
                            updateSkin(zobal.level); // Met à jour le skin en fonction du niveau
                        }
                    }
                });
            }

            changeSkin();
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
});