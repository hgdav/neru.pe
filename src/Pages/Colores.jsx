import React, { useState, useEffect } from 'react';
import { MdDownload } from "react-icons/md";
import html2canvas from 'html2canvas';

const Colores = () => {
    const [colors, setColors] = useState({});
    const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Cargar los colores desde el JSON
    useEffect(() => {
        async function loadColors() {
            try {
                const response = await fetch("paletas.json");
                const colorsData = await response.json();
                setColors(colorsData);
            } catch (error) {
                console.error("Error al cargar el archivo JSON:", error);
            }
        }
        loadColors();
    }, []);

    // Actualizar las sugerencias de colores basados en el input
    useEffect(() => {
        if (colorInput) {
            const input = colorInput.toLowerCase();
            const filteredSuggestions = Object.keys(colors).filter(colorName =>
                colorName.toLowerCase().includes(input)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [colorInput, colors]);

    // Seleccionar color
    const selectColor = (colorName) => {
        if (coloresSeleccionados.length < 3) {
            setColoresSeleccionados([...coloresSeleccionados, colorName]);
        } else {
            alert("Solo puedes seleccionar tres colores. La página se recargará.");
            window.location.reload();
        }
        setColorInput("");
        setSuggestions([]); // Limpiar sugerencias después de seleccionar
    };

    // Generar imagen con los colores seleccionados (mantener tamaño fijo de 750x562 para la descarga)
    const generateImage = () => {
        const colorContainer = document.getElementById("colorContainer");
        if (!colorContainer) return;

        // Guardar estilos originales
        const originalStyles = {
            width: colorContainer.style.width,
            height: colorContainer.style.height,
            maxWidth: colorContainer.style.maxWidth,
            paddingBottom: colorContainer.style.paddingBottom,
        };

        // Establecer tamaño fijo para la generación de la imagen
        colorContainer.style.width = '750px';
        colorContainer.style.height = '562px';
        colorContainer.style.maxWidth = 'unset';
        colorContainer.style.paddingBottom = 'unset';

        html2canvas(colorContainer).then((canvas) => {
            // Restaurar estilos originales
            colorContainer.style.width = originalStyles.width;
            colorContainer.style.height = originalStyles.height;
            colorContainer.style.maxWidth = originalStyles.maxWidth;
            colorContainer.style.paddingBottom = originalStyles.paddingBottom;

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = coloresSeleccionados.join(" - ") + ".png";
            link.click();
            window.location.reload();
        });
    };

    // Determinar el ancho para cada sección dependiendo del número de colores seleccionados
    const getSectionWidth = () => {
        return coloresSeleccionados.length > 0 ? `${100 / coloresSeleccionados.length}%` : '0%';
    };

    return (
        <main className="p-8 bg-bg-base">
            <div className="card bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Paleta de Colores</h2>
                <div className="input-container mb-4">
                    <div className="inputs flex items-center gap-4">
                        <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            placeholder="Colores"
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        <MdDownload onClick={generateImage} size={32} className="cursor-pointer" />
                    </div>
                    <div id="suggestions" className="mt-2 space-y-2">
                        {suggestions.map((colorName) => (
                            <div
                                key={colorName}
                                className="suggestion p-2 bg-accent-muted rounded-md cursor-pointer"
                                onClick={() => selectColor(colorName)}
                                style={{ backgroundColor: colors[colorName] }}
                            >
                                {colorName}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Segunda tarjeta con los colores seleccionados */}
            <div
                className={`card bg-white shadow-md rounded-lg p-6 mt-6 ${coloresSeleccionados.length > 0 ? '' : 'hidden'}`}
                id="secondCard"
            >
                {/* Contenedor responsivo */}
                <div
                    className="color-container relative mx-auto"
                    style={{
                        width: '100%',
                        maxWidth: '750px', // Máximo ancho para pantallas grandes
                        position: 'relative',
                        paddingBottom: `${(562 / 750) * 100}%`, // Mantener relación de aspecto
                    }}
                    id="colorContainer"
                >
                    {coloresSeleccionados.map((color, index) => (
                        <div
                            key={index}
                            className="absolute h-full"
                            style={{
                                left: `${(index * (100 / coloresSeleccionados.length))}%`,
                                width: getSectionWidth(),
                                backgroundColor: colors[color],
                                top: 0,
                                bottom: 0,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export { Colores };
