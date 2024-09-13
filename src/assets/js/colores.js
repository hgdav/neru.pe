import html2canvas from "html2canvas";
loadColors();

let colors = {};

async function loadColors() {
    try {
        const response = await fetch("paletas.json");
        colors = await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

// Aseguramos que los elementos existen en el DOM y son del tipo correcto
const colorInput = document.getElementById("colorInput");
const suggestionsDiv = document.getElementById("suggestions");
const colorContainer = document.getElementById("colorContainer");
const btnDownload = document.getElementById("downloadButton");

colorInput.focus();

let colores = [];

if (colorInput && suggestionsDiv && colorContainer && btnDownload) {
    colorInput.addEventListener("input", updateSuggestions);

    colorInput.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            event.preventDefault();
            const firstSuggestion =
                suggestionsDiv.firstChild;
            if (firstSuggestion) {
                selectColor(firstSuggestion.textContent || "");
            }
        }
    });

    btnDownload.addEventListener("click", () => {
        generateImage();
    });
}

function unHidden() {
    document
        .getElementById("secondCard")
        ?.classList.remove("hidden");
}

function updateSuggestions() {
    if (!colorInput || !suggestionsDiv) return;

    const input = colorInput.value.toLowerCase();
    suggestionsDiv.innerHTML = "";

    if (input) {
        Object.keys(colors).forEach((colorName) => {
            if (colorName.toLowerCase().includes(input)) {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.classList.add("suggestion");
                suggestionDiv.textContent = colorName;
                suggestionDiv.style.backgroundColor =
                    colors[colorName];
                suggestionsDiv.appendChild(suggestionDiv);

                suggestionDiv.addEventListener("click", () =>
                    selectColor(colorName),
                );
            }
        });
    }
}

function selectColor(colorName) {
    unHidden();
    if (
        !colorInput ||
        !suggestionsDiv ||
        !colorContainer ||
        !btnDownload
    )
        return;

    colorInput.value = colorName;
    suggestionsDiv.innerHTML = "";

    if (colores.length < 3) {
        colores.push(colorName);
        updateColorContainer();
        colorContainer.style.display = "inline-flex";
        btnDownload.style.display = "block";
    }

    if (colores.length > 3) {
        alert(
            "Solo puedes seleccionar tres colores. La página se recargará.",
        );
        window.location.reload();
    }

    colorInput.value = "";
    colorInput.focus();
}

function updateColorContainer() {
    if (!colorContainer) return;

    colorContainer.innerHTML = "";
    colores.forEach((color, index) => {
        const colorDiv = document.createElement("div");
        colorDiv.id = `color-${index + 1}`;
        colorDiv.style.backgroundColor = colors[color];
        colorDiv.classList.add("colores");
        colorContainer.appendChild(colorDiv);
    });
}

function generateImage() {
    if (!colorContainer) return;

    html2canvas(colorContainer).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        if (colores.length > 2) {
            link.download = `${colores[0]} - ${colores[1]} - ${colores[2]}.png`;
        } else {
            link.download = `${colores[0]} - ${colores[1]}.png`;
        }
        link.click();
        window.location.reload();
    });
}
