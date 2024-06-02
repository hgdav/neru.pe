document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const packs = {};

        // Almacenar los packs y los productos individuales
        lines.forEach(function (line) {
            const columns = line.split(',');
            if (columns.length >= 12) {
                const nombre = columns[1].trim();
                const stock = parseInt(columns[11].trim());
                const talla = columns[3].trim();
                const color = columns[5].trim();

                if (nombre.startsWith("pack-")) {
                    if (!packs[nombre]) {
                        packs[nombre] = [];
                    }
                    packs[nombre].push({ color, talla });
                } else {
                    const sku = columns[8].trim();
                    if (!packs[sku]) {
                        packs[sku] = [];
                    }
                    packs[sku].push({ color, talla, stock });
                }
            }
        });

        // Verificar disponibilidad de cada pack
        const packsDisponibles = [];
        for (const nombre in packs) {
            if (nombre.startsWith("pack-")) {
                const productosEnPack = packs[nombre];
                const combinacionValida = productosEnPack.every(productoPack => {
                    const { color, talla } = productoPack;
                    const productosRelacionados = packs[color + talla];
                    return productosRelacionados && productosRelacionados.some(productoRelacionado => productoRelacionado.stock > 1);
                });

                if (combinacionValida) {
                    packsDisponibles.push(nombre);
                }
            }
        }

        // Mostrar los packs disponibles
        console.log("Packs disponibles:");
        packsDisponibles.forEach(function (pack) {
            console.log(pack);
        });
    };

    reader.readAsText(file);
});
