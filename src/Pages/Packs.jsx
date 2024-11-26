import React, { useState } from 'react';
import Papa from 'papaparse';

const Packs = () => {
    const [packAvailability, setPackAvailability] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Guardar los datos originales del CSV
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: function (results) {
                    setOriginalData(results.data); // Guardar los datos originales para la descarga
                    processCSVData(results.data);
                },
            });
        }
    };

    const processCSVData = (data) => {
        const packs = data.filter(item => item.Title && item.Title.includes('Pack'));
        const products = data.filter(item => item.Title && !item.Title.includes('Pack'));

        const packAvailability = packs.map(pack => {
            const packName = pack.Title;
            const packSize = pack['Option1 Value'];
            const packColors = pack['Option2 Value'] ? pack['Option2 Value'].split(' - ') : [];

            let available = true;
            let unavailableColors = [];

            for (const color of packColors) {
                const productAvailable = products.some(product =>
                    product['Option1 Value'] === packSize &&
                    product['Option2 Value'].toLowerCase().trim() === color.toLowerCase().trim() &&
                    Number(product.Available) > 1
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
                unavailableColors: unavailableColors.join(', '),
            };
        });

        setPackAvailability(packAvailability);
    };

    const displayModal = (packName) => {
        const filteredPacks = packAvailability.filter(pack => pack.packName === packName);
        let content = `
            <table className="w-full text-left">
                <thead>
                    <tr><th>Pack</th><th>Talla</th><th>Colores</th><th>Disponibilidad</th></tr>
                </thead>
                <tbody>`;

        filteredPacks.forEach(pack => {
            content += `
                <tr class="${pack.available ? 'bg-green-100' : 'bg-red-100'} hover:bg-gray-100 border-b">
                    <td>${pack.packName}</td>
                    <td>${pack.packSize}</td>
                    <td>${pack.packColors}</td>
                    <td>${pack.available ? 'Disponible' : `No Disponibles: ${pack.unavailableColors}`}</td>
                </tr>`;
        });

        content += '</tbody></table>';
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...packAvailability].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setPackAvailability(sortedData);
    };

    // Nueva función para generar y descargar el CSV actualizado con toda la información original

    const generateUpdatedCSV = () => {
        const updatedPackData = packAvailability.filter(pack => pack.available).map(pack => {
            const originalProduct = originalData.find(product =>
                product.Title === pack.packName &&
                product['Option1 Value'] === pack.packSize
            );

            const newPackData = {
                Handle: "",
                Title: "",
                'Option1 Name': "",
                'Option1 Value': "",
                'Option2 Name': "",
                'Option2 Value': "",
                'Option3 Name': "",
                'Option3 Value': "",
                SKU: "",
                'HS Code': "",
                COO: "",
                Location: "",
                Incoming: "",
                Unavailable: "",
                Committed: "",
                Available: "",
                'On hand': ""
            };

            // Copiar los valores del pack original si existe
            if (originalProduct) {
                for (const key in newPackData) {
                    newPackData[key] = originalProduct[key] || "";
                }
            }

            // Actualizar los valores específicos del pack disponible
            newPackData.Title = pack.packName;
            newPackData['Option1 Value'] = pack.packSize;
            newPackData['Option2 Value'] = pack.packColors;
            newPackData.Available = '1';


            return newPackData;
        });

        const csv = Papa.unparse(updatedPackData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'available_packs.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="card bg-input-bg shadow-md rounded-3xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Verificador de Packs</h2>
                <input
                    type="file"
                    id="fileInput"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>

            {packAvailability.length > 0 && (
                <div className="card bg-input-bg shadow-md rounded-3xl p-6 w-full mt-4">
                    <button
                        onClick={generateUpdatedCSV}
                        className="bg-accent-secondary text-white px-4 py-2 rounded-md mt-4 mb-4 float-right"
                    >
                        CSV Actualizado
                    </button>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => handleSort('packName')}
                                >
                                    Pack
                                </th>
                                <th
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => handleSort('packSize')}
                                >
                                    Talla
                                </th>
                                <th
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => handleSort('packColors')}
                                >
                                    Colores
                                </th>
                                <th
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => handleSort('available')}
                                >
                                    Disponibilidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {packAvailability.map((pack, index) => (
                                <tr
                                    key={index}
                                    className={`cursor-pointer ${pack.available ? 'bg-green-100' : 'bg-red-100'} hover:bg-gray-100 border-b`}
                                    onClick={() => displayModal(pack.packName)}
                                >
                                    <td>{pack.packName}</td>
                                    <td>{pack.packSize}</td>
                                    <td>{pack.packColors}</td>
                                    <td>{pack.available ? 'Disponible' : `No Disponibles: ${pack.unavailableColors}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-red-500 font-bold text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>
                        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export { Packs };
