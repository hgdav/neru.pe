document.addEventListener("DOMContentLoaded", () => {
    loadColors();
});

let colors = {};

async function loadColors() {
    try {
        const response = await fetch('/assets/bd/paletas.json');
        colors = await response.json();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

const colorInput = document.getElementById('colorInput');
const suggestionsDiv = document.getElementById('suggestions');
const colorContainer = document.getElementById('colorContainer');
const btnDownload = document.getElementById('downloadButton');

let colores = [];

colorInput.addEventListener('input', () => {
    const input = colorInput.value.toLowerCase();
    suggestionsDiv.innerHTML = '';

    if (input) {
        Object.keys(colors).forEach(colorName => {
            if (colorName.toLowerCase().includes(input)) {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.classList.add('suggestion');
                suggestionDiv.textContent = colorName;
                suggestionDiv.style.backgroundColor = colors[colorName];
                suggestionsDiv.appendChild(suggestionDiv);

                suggestionDiv.addEventListener('click', () => {
                    colorInput.value = colorName;
                    suggestionsDiv.innerHTML = '';
                    colores.push(colorName);
                    if (colores.length == 3) {
                        document.getElementById("color-1").style.backgroundColor = colors[colores[0]];
                        document.getElementById("color-2").style.backgroundColor = colors[colores[1]];
                        document.getElementById("color-3").style.backgroundColor = colors[colores[2]];
                        colorContainer.style.display = "inline-flex";
                        btnDownload.style.display = "block";

                    } else if (colores.length > 3) {
                        alert("Solo puedes seleccionar tres colores. La página se recargará.");
                        window.location.reload();
                    }
                    colorInput.value = '';
                });

            }
        });
    }
});

btnDownload.addEventListener('click', () => {
    html2canvas(document.getElementById('colorContainer')).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'selected_colors.png';
        link.click();
    });
});