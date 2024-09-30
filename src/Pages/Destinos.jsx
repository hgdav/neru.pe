import React, { useState, useEffect } from 'react';

const Destinos = () => {
    const [destinos, setDestinos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDestinos, setFilteredDestinos] = useState([]);

    useEffect(() => {
        async function loadDestinos() {
            try {
                const response = await fetch("destinos.json");
                const data = await response.json();
                setDestinos(data);
            } catch (error) {
                console.error("Error al cargar el archivo JSON:", error);
            }
        }
        loadDestinos();
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = destinos.filter(destino =>
                destino.DESTINO.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDestinos(filtered);
        } else {
            setFilteredDestinos([]);
        }
    }, [searchTerm, destinos]);

    return (
        <div className="bg-bg-base flex flex-col items-center justify-center p-4 mt-2">
            <div className="card bg-input-bg shadow-md rounded-3xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Destinos Caros</h2>
                <div className="input-container flex flex-col items-center justify-center space-y-4">
                    <input
                        type="text"
                        id="destinoInput"
                        placeholder="Buscar destinos"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                    />
                    <div id="destinos-suggestions" className="w-full space-y-2">
                        {filteredDestinos.length > 0 ? (
                            filteredDestinos.map((destino, index) => (
                                <div key={index} className="destinos-suggestion-item flex justify-between p-2 bg-accent-secondary rounded-lg shadow">
                                    <span className="text-accent-secondary-dark">{destino.DESTINO}</span>
                                    <span className="text-accent-secondary-dark font-semibold">S/. {destino.COSTO_DE_ENVIO}</span>
                                </div>
                            ))
                        ) : (
                            searchTerm && (
                                <div className="text-center text-red-500">
                                    No se encontraron coincidencias
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Destinos };
