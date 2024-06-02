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

        console.log(`Procesando pack: ${pack[1]}, Tamaño: ${packSize}, Colores: ${packColors}`);

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

            console.log(`Revisando color: ${color}, Producto encontrado: ${product ? product[1] : 'None'}`);

            return product && parseInt(product[11]) > 1; // Asegúrate de que el índice del stock es correcto
        });

        console.log(`Pack disponible: ${allProductsInStock}`);
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
    ['Nombre del Pack', 'Tamaño', 'Color'].forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
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
        table.appendChild(row);
    });

    resultDiv.appendChild(table);
}

function processFile() {
    document.getElementById('fileInput').click();
}
