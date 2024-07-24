document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                processCSVData(results.data);
            }
        });
    }
}

function processCSVData(data) {
    const packs = data.filter(item => item.Title && item.Title.includes('Pack'));
    const products = data.filter(item => item.Title && !item.Title.includes('Pack'));

    const packAvailability = packs.map(pack => {
        const packName = pack.Title;
        const packSize = pack['Option1 Value'];
        const packColors = pack['Option2 Value'].split(' - ');

        let available = true;
        let unavailableColors = [];

        for (const color of packColors) {
            const productAvailable = products.some(product =>
                product['Option1 Value'] === packSize &&
                product['Option2 Value'].toLowerCase().trim() === color.toLowerCase().trim() &&
                Number(product.Available) > 1 // Cambiado a > 0 para considerar disponible si hay stock
            );

            if (!productAvailable) {
                available = false;
                unavailableColors.push(color);
            }
        }

        return {
            packName,
            packSize,
            packColors: packColors.join(', '),
            available,
            unavailableColors: unavailableColors.join(', ')
        };
    });

    // Ordenar por tipo (nombre del pack) y luego por talla
    packAvailability.sort((a, b) => {
        if (a.packName < b.packName) return -1;
        if (a.packName > b.packName) return 1;
        if (a.packSize < b.packSize) return -1;
        if (a.packSize > b.packSize) return 1;
        return 0;
    });

    displayResults(packAvailability);
}

function displayResults(packAvailability) {
    const resultsDiv = document.getElementById('results');
    let results = '<table><thead><tr><th>Pack</th><th>Talla</th><th>Colores</th><th>Disponibilidad</th></tr></thead><tbody>';

    packAvailability.forEach((pack, index) => {
        results += `<tr class="${pack.available ? 'available' : 'unavailable'}" data-index="${index}">
                        <td>${pack.packName}</td>
                        <td>${pack.packSize}</td>
                        <td>${pack.packColors}</td>
                        <td>${pack.available ? 'Disponible' : `<strong>No Disponibles:</strong> ${pack.unavailableColors}`}</td>
                    </tr>`;
    });

    results += '</tbody></table>';
    resultsDiv.innerHTML = results;

    // Agregar event listener a cada fila
    document.querySelectorAll('tr[data-index]').forEach(row => {
        row.addEventListener('click', function () {
            const packName = this.querySelector('td').textContent;
            showModal(packName, packAvailability);
        });
    });
}

function showModal(packName, packAvailability) {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');

    const filteredPacks = packAvailability.filter(pack => pack.packName === packName);
    let content = `<table><thead><tr><th>Pack</th><th>Talla</th><th>Colores</th><th>Disponibilidad</th></tr></thead><tbody>`;

    filteredPacks.forEach(pack => {
        content += `<tr class="${pack.available ? 'available' : 'unavailable'}">
                        <td>${pack.packName}</td>
                        <td>${pack.packSize}</td>
                        <td>${pack.packColors}</td>
                        <td>${pack.available ? 'Disponible' : `<strong>No Disponibles:</strong> ${pack.unavailableColors}`}</td>
                    </tr>`;
    });

    content += `</tbody></table>`;
    modalContent.innerHTML = content;
    modal.style.display = "block";

    // Cerrar el modal
    document.querySelector('.close').onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
