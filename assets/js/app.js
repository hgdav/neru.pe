document.addEventListener("DOMContentLoaded", () => {
    loadColors();
    colorInput.focus();
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

colorInput.addEventListener('input', updateSuggestions);

colorInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const firstSuggestion = suggestionsDiv.firstChild;
        if (firstSuggestion) {
            selectColor(firstSuggestion.textContent);
        }
    }
});

function updateSuggestions() {
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

                suggestionDiv.addEventListener('click', () => selectColor(colorName));
            }
        });
    }
}

function selectColor(colorName) {
    colorInput.value = colorName;
    suggestionsDiv.innerHTML = '';
    if (colores.length < 3) {
        colores.push(colorName);
        updateColorContainer();
        colorContainer.style.display = "inline-flex";
        btnDownload.style.display = "block";
    }

    if (colores.length > 3) {
        alert("Solo puedes seleccionar tres colores. La página se recargará.");
        window.location.reload();
    }

    colorInput.value = '';
    colorInput.focus();
}

btnDownload.addEventListener('click', () => {
    generateImage();
});

function updateColorContainer() {
    colorContainer.innerHTML = '';
    colorInput.focus();
    colores.forEach((color, index) => {
        const colorDiv = document.createElement('div');
        colorDiv.id = `color-${index + 1}`;
        colorDiv.style.backgroundColor = colors[color];
        colorDiv.style.width = '600px';
        colorDiv.style.height = '450px';
        colorContainer.appendChild(colorDiv);
    });
}

function generateImage() {
    html2canvas(colorContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        if (colores.length > 2) {
            link.download = colores[0] + ' - ' + colores[1] + ' - ' + colores[2] + '.png';
        } else {
            link.download = colores[0] + ' - ' + colores[1] + '.png';
        }
        link.click();
        window.location.reload();
    });
}