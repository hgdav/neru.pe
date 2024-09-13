let destinos = [];

async function loadDestinos() {
    try {
        const response = await fetch("destinos.json");
        destinos = await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

loadDestinos();

const inputElement = document.getElementById("destinoInput");
const suggestionsElement = document.getElementById("destinos-suggestions");

inputElement.focus();

inputElement.addEventListener("input", function () {
    const searchTerm = inputElement.value.toLowerCase();
    suggestionsElement.innerHTML = ""; // Limpiar sugerencias anteriores

    if (searchTerm.length > 0) {
        const filteredDestinos = destinos.filter(destino =>
            destino.DESTINO.toLowerCase().includes(searchTerm)
        );

        if (filteredDestinos.length > 0) {
            filteredDestinos.forEach(destino => {
                const suggestionItem = document.createElement("div");
                suggestionItem.classList.add("destinos-suggestion-item");

                // Crear dos spans: uno para el destino y otro para el costo
                const destinoSpan = document.createElement("span");
                destinoSpan.textContent = destino.DESTINO;

                const costoSpan = document.createElement("span");
                costoSpan.classList.add("costo");
                costoSpan.textContent = `S/. ${destino.COSTO_DE_ENVIO}`;

                // Añadir los spans al item
                suggestionItem.appendChild(destinoSpan);
                suggestionItem.appendChild(costoSpan);

                suggestionsElement.appendChild(suggestionItem);
            });
        } else {
            const noMatch = document.createElement("div");
            noMatch.classList.add("destinos-no-match");
            noMatch.textContent = "No se encontraron coincidencias";
            suggestionsElement.appendChild(noMatch);
        }
    }
});
