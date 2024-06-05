document.addEventListener('DOMContentLoaded', function () {
    let tipo = '';

    const cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            const paragraph = card.querySelector('p');
            const valor = paragraph.textContent;
            cards.forEach(function (card) {
                card.classList.remove('selected');
            });
            card.classList.add('selected');
            tipo = valor;
        });
    });

    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const dni = document.getElementById('dni');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');
    const departamento = document.getElementById('departamento');
    const provincia = document.getElementById('provincia');
    const distrito = document.getElementById('distrito');
    const productoInput = document.getElementById('productoInput');
    const precioInput = document.getElementById('precioInput');

    document.getElementById('btn-generar').addEventListener('click', () => {
        if (tipo === 'Ticket') {
            generarTicket();
        } else if (tipo === 'Rótulo') {
            generarRotulo();
        } else if (tipo === 'Guía') {
            generarGuia();
        }
    });

    const generarTicket = () => {
        var numeroticket = Math.floor(Math.random() * (3000 - 100 + 1)) + 100;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [80, 297]);

        const imgData = 'https://cdn.shopify.com/s/files/1/0760/7582/7479/files/LOGOTIPO-NERU.png?v=1689712534';
        doc.addImage(imgData, 'PNG', 18, 5, 45, 15); // X, Y, W, H

        // Estilos y estructura del ticket
        doc.setFontSize(12);

        doc.setFontSize(10);
        doc.text(`RUC: 20603663200`, 40, 28, { align: 'center' });
        doc.text(`#${numeroticket}`, 40, 33, { align: 'center' });
        doc.text(`${new Date().toLocaleDateString()}`, 40, 38, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Cliente`, 10, 45);
        doc.setFont('helvetica', 'normal');

        doc.text(`${nombre.value} ${apellido.value}`, 10, 50);
        doc.text(`${dni.value}`, 10, 55);
        doc.text(`${direccion.value}`, 10, 60);
        doc.text(`${distrito.value} - ${provincia.value}`, 10, 65);
        doc.text(`${departamento.value.toUpperCase()}`, 10, 70);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Item`, 10, 75);
        doc.text(`Precio`, 60, 75);
        doc.setFont('helvetica', 'normal');

        doc.setLineWidth(0.1);
        doc.line(10, 77, 70, 77);

        // Dividir el texto en líneas para el producto
        const maxLength = 55;
        const linesProducto = doc.splitTextToSize(productoInput.value, maxLength);
        let y = 82;

        doc.setFontSize(8);

        linesProducto.forEach(line => {
            doc.text(line, 10, y);
            y += 5;
        });
        doc.text(`S/ ${precioInput.value}`, 60, 80 + linesProducto.length / 2);

        const subtotal = parseFloat(precioInput.value).toFixed(2);
        const igv = (parseFloat(precioInput.value) * 0.18).toFixed(2);
        let realsubtotal = subtotal - igv;
        const total = (parseFloat(precioInput.value)).toFixed(2);

        doc.text('Subtotal', 10, 105);
        doc.text(`S/. ${realsubtotal}`, 58, 105);


        doc.text('IGV', 10, 110);
        doc.text(`S/. ${igv}`, 58, 110);

        doc.setFont('helvetica', 'bold');
        doc.text('Total', 10, 115);
        doc.text(`S/. ${total}`, 58, 115);
        doc.setFont('helvetica', 'normal');

        doc.setLineWidth(0.1);
        doc.line(10, 117 + 2, 70, 117 + 2); // Línea separadora antes del footer

        doc.setFontSize(8);
        doc.text('Si tienes dudas o consultas, no dudes en', 12, 120 + 2);
        doc.text('enviarnos un email a ventas.neru@gmail.com', 10, 123 + 2);

        imprimirTicket(doc);
    };

    const generarRotulo = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [80, 297]); // Ancho de 80mm

        // Añade el contenido para el rótulo
        doc.setFontSize(10);
        doc.text('Rótulo de Envío', 40, 10, null, null, 'center');
        doc.setFontSize(8);
        doc.text(`Nombre: ${nombre.value} ${apellido.value}`, 10, 20);
        doc.text(`DNI: ${dni.value}`, 10, 25);
        doc.text(`Teléfono: ${telefono.value}`, 10, 30);
        doc.text(`Dirección: ${direccion.value}`, 10, 35);
        doc.text(`Departamento: ${departamento.value}`, 10, 40);
        doc.text(`Provincia: ${provincia.value}`, 10, 45);
        doc.text(`Distrito: ${distrito.value}`, 10, 50);

        imprimirTicket(doc);
    };

    const generarGuia = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [80, 297]); // Ancho de 80mm

        // Añade el contenido para la guía
        doc.setFontSize(10);
        doc.text('Guía de Remisión', 40, 10, null, null, 'center');
        doc.setFontSize(8);
        doc.text(`Nombre: ${nombre.value} ${apellido.value}`, 10, 20);
        doc.text(`DNI: ${dni.value}`, 10, 25);
        doc.text(`Teléfono: ${telefono.value}`, 10, 30);
        doc.text(`Dirección: ${direccion.value}`, 10, 35);
        doc.text(`Departamento: ${departamento.value}`, 10, 40);
        doc.text(`Provincia: ${provincia.value}`, 10, 45);
        doc.text(`Distrito: ${distrito.value}`, 10, 50);
        doc.text(`Producto: ${productoInput.value}`, 10, 55);
        doc.text(`Precio: ${precioInput.value}`, 10, 60);

        imprimirTicket(doc);
    };

    const imprimirTicket = (doc) => {
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<iframe width='100%' height='100%' src='${pdfUrl}'></iframe>`);
        printWindow.document.close();

    };
});
