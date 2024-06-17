document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let sizeIndex, colorIndex, stockIndex; // Variables globales

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
        Papa.parse(file, {
            complete: function (results) {
                processCSV(results.data);
            },
            header: true
        });
    } else {
        alert('Por favor sube un archivo CSV.');
    }
}

function processCSV(data) {
    const headers = Object.keys(data[0]);
    const packs = data.filter(row => row.Title && row.Title.includes('Pack'));
    const products = data.filter(row => row.Title && !row.Title.includes('Pack'));

    sizeIndex = headers.indexOf('Tamaño') !== -1 ? headers.indexOf('Tamaño') : headers.indexOf('Size');
    colorIndex = headers.indexOf('Color');
    stockIndex = headers.indexOf('Available');

    if (sizeIndex === -1 || colorIndex === -1 || stockIndex === -1) {
        console.error("No se encontraron las columnas 'Tamaño', 'Color' o 'Available' en los encabezados.");
        return;
    }

    const availablePacks = packs.filter(pack => {
        const packNameMatch = pack.Title.match(/Pack (.*?) x/); // Ajustar el regex según sea necesario
        const packName = packNameMatch ? packNameMatch[1].trim() : null;
        const packSize = pack.Tamaño;
        const packColors = pack.Color.split(' - ').map(color => color.trim().toLowerCase());

        if (!packName) return false;

        const allProductsInStock = packColors.every(color => {
            const matchingProducts = products.filter(product => {
                const productName = product.Title.trim().toLowerCase();
                const productSize = product.Tamaño;
                const productColor = product.Color;
                const inStock = parseInt(product.Available);

                return productSize && productColor &&
                    productName.includes(packName.toLowerCase()) &&
                    productSize.trim().toLowerCase() === packSize.trim().toLowerCase() &&
                    productColor.trim().toLowerCase() === color &&
                    inStock > 1;
            });

            return matchingProducts.length >= 1; // Ajustar la condición según el requerimiento
        });

        return allProductsInStock;
    });

    displayResult(availablePacks, headers);
}

function displayResult(packs, headers) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (packs.length === 0) {
        resultDiv.innerHTML = '<p>No hay packs disponibles.</p>';
        return;
    }

    packs.sort((a, b) => a.Title.localeCompare(b.Title));

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    ['Nombre del Pack', 'Talla', 'Color'].forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
        header.addEventListener('click', () => sortTableByColumn(table, headerText));
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    packs.forEach(pack => {
        const row = document.createElement('tr');
        [pack.Title, pack.Tamaño, pack.Color].forEach(cellText => {
            const cell = document.createElement('td');
            cell.innerText = cellText;
            row.appendChild(cell);
        });
        row.addEventListener('click', () => showPopup(pack.Title, packs, headers));
        table.appendChild(row);
    });

    resultDiv.appendChild(table);
}

function sortTableByColumn(table, column) {
    const headers = Array.from(table.querySelectorAll('th'));
    const columnIndex = headers.findIndex(header => header.innerText === column);
    const rows = Array.from(table.querySelectorAll('tr:nth-child(n+2)')); // excluye la cabecera

    const sortedRows = rows.sort((a, b) => {
        const aText = a.children[columnIndex].innerText.toLowerCase();
        const bText = b.children[columnIndex].innerText.toLowerCase();

        return aText.localeCompare(bText);
    });

    sortedRows.forEach(row => table.appendChild(row));
}

function showPopup(packName, packs, headers) {
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = '';

    const filteredPacks = packs.filter(pack => pack.Title === packName);

    // Sort filtered packs by size/talla by default
    const packSizeIndex = headers.indexOf('Tamaño');
    const colorIndex = headers.indexOf('Color');

    // Ensure the indexes are valid
    if (packSizeIndex === -1 || colorIndex === -1) {
        console.error("No se encontraron las columnas 'Tamaño' o 'Color' en los encabezados.");
        return;
    }

    filteredPacks.sort((a, b) => {
        const aSize = a.Tamaño ? a.Tamaño.toLowerCase() : "";
        const bSize = b.Tamaño ? b.Tamaño.toLowerCase() : "";
        return aSize.localeCompare(bSize);
    });

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    ['Nombre del Pack', 'Talla', 'Color'].forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
        header.addEventListener('click', () => sortTableByColumn(table, headerText));
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    filteredPacks.forEach(pack => {
        const row = document.createElement('tr');
        const packSize = pack.Tamaño ? pack.Tamaño : "";
        const packColor = pack.Color ? pack.Color : "";
        [pack.Title, packSize, packColor].forEach(cellText => {
            const cell = document.createElement('td');
            cell.innerText = cellText;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    popupContent.appendChild(table);

    document.body.style.overflow = 'hidden';
    document.getElementById('overlay').style.display = 'flex';
}

function closePopup() {
    document.body.style.overflow = 'auto';
    document.getElementById('overlay').style.display = 'none';
}

function processFile() {
    document.getElementById('fileInput').click();
}
