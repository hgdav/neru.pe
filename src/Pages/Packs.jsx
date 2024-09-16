import React, { useState } from 'react';
import Papa from 'papaparse';

const Packs = () => {
    const [packAvailability, setPackAvailability] = useState([]);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: function (results) {
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
