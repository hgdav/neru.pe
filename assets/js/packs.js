document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
        Papa.parse(file, {
            complete: function (results) {
                processCSV(results.data);
            }
        });
    } else {
        alert('Por favor sube un archivo CSV.');
    }
}

function processCSV(data) {
    const packs = data.filter(row => row[0] && row[0].includes('pack'));
    const products = data.filter(row => row[0] && !row[0].includes('pack'));

    const availablePacks = packs.filter(pack => {
        const packSizeIndex = pack.indexOf('Tamaño') !== -1 ? pack.indexOf('Tamaño') + 1 : pack.indexOf('Size') + 1;
        const packColorIndex = pack.indexOf('Color') + 1;
        const packSize = pack[packSizeIndex];
        const packColors = pack[packColorIndex].split(' - ').map(color => color.trim().toLowerCase());

        const allProductsInStock = packColors.every(color => {
            const product = products.find(product => {
                const productSizeIndex = product.indexOf('Tamaño') !== -1 ? product.indexOf('Tamaño') + 1 : product.indexOf('Size') + 1;
                const productColorIndex = product.indexOf('Color') + 1;
                const productSize = product[productSizeIndex];
                const productColor = product[productColorIndex];

                return productSize && productColor &&
                    productSize.trim().toLowerCase() === packSize.trim().toLowerCase() &&
                    productColor.trim().toLowerCase() === color;
            });
            return product && parseInt(product[11]) > 1;
        });

        return allProductsInStock;
    });

    displayResult(availablePacks);
}

function displayResult(packs) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (packs.length === 0) {
        resultDiv.innerHTML = '<p>No hay packs disponibles.</p>';
        return;
    }

    packs.sort((a, b) => a[1].localeCompare(b[1]));

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
        const packSizeIndex = pack.indexOf('Tamaño') !== -1 ? pack.indexOf('Tamaño') + 1 : pack.indexOf('Size') + 1;
        const packColorIndex = pack.indexOf('Color') + 1;
        [pack[1], pack[packSizeIndex], pack[packColorIndex]].forEach(cellText => {
            const cell = document.createElement('td');
            cell.innerText = cellText;
            row.appendChild(cell);
        });
        row.addEventListener('click', () => showPopup(pack[1], packs));
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


function showPopup(packName, packs) {
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = '';

    const filteredPacks = packs.filter(pack => pack[1] === packName);

    // Sort filtered packs by size/talla by default
    const packSizeIndex = filteredPacks[0].indexOf('Tamaño') !== -1 ? filteredPacks[0].indexOf('Tamaño') + 1 : filteredPacks[0].indexOf('Size') + 1;
    filteredPacks.sort((a, b) => a[packSizeIndex].localeCompare(b[packSizeIndex]));

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
        [pack[1], pack[packSizeIndex], pack[pack.indexOf('Color') + 1]].forEach(cellText => {
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
