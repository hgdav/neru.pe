import React, { useState } from 'react';

const Tallas = () => {
    const [talla, setTalla] = useState('');
    const [peso, setPeso] = useState('');
    const [estilo, setEstilo] = useState('1');
    const [resultado, setResultado] = useState('');
    const [error, setError] = useState('');

    // Función para calcular la talla recomendada
    const calcularTalla = (event) => {
        event.preventDefault();
        clearErrors();

        try {
            const tallaValida = validarCampo('talla', talla, 100, 250);
            const pesoValido = validarCampo('peso', peso, 30, 200);
            const estiloValido = validarEstilo();

            const resultado = obtenerTallaRecomendada(tallaValida, pesoValido, estiloValido);
            mostrarResultado(resultado);
        } catch (error) {
            mostrarError(error.message);
        }
    };

    // Validar campos
    const validarCampo = (nombre, valor, min, max) => {
        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico < min || valorNumerico > max) {
            throw new Error(`Por favor, ingresa un(a) ${nombre} válido(a).`);
        }
        return valorNumerico;
    };

    // Validar el estilo seleccionado
    const validarEstilo = () => {
        if (!estilo) {
            throw new Error('Por favor, selecciona un estilo.');
        }
        return estilo;
    };

    // Obtener la talla recomendada
    const obtenerTallaRecomendada = (talla, peso, estilo) => {
        if (talla >= 150 && talla <= 170 && peso >= 50 && peso <= 65) {
            if (estilo === '1' || estilo === '2') {
                return 'TALLA S';
            } else if (estilo === '3') {
                return 'TALLA M';
            }
        } else if (talla >= 150 && talla <= 175 && peso >= 60 && peso <= 75) {
            if (estilo === '1') {
                return 'TALLA S';
            } else if (estilo === '2') {
                return 'TALLA M';
            } else if (estilo === '3') {
                return 'TALLA L';
            }
        } else if (talla >= 175 && talla <= 185 && peso >= 60 && peso <= 65) {
            if (estilo === '1' || estilo === '2') {
                return 'TALLA M';
            } else if (estilo === '3') {
                return 'TALLA L';
            }
        } else if (talla >= 160 && talla <= 185 && peso >= 65 && peso <= 90) {
            if (estilo === '1') {
                return 'TALLA M';
            } else if (estilo === '2') {
                return 'TALLA L';
            } else if (estilo === '3') {
                return 'TALLA XL';
            }
        } else if (talla >= 185 && talla <= 190 && peso >= 65 && peso <= 84) {
            if (estilo === '1') {
                return 'TALLA L';
            } else if (estilo === '2' || estilo === '3') {
                return 'TALLA XL';
            }
        } else if (talla >= 160 && talla <= 190 && peso >= 85 && peso <= 95) {
            if (estilo === '1') {
                return 'TALLA L';
            } else if (estilo === '2' || estilo === '3') {
                return 'TALLA XL';
            }
        } else if (talla > 190 && peso >= 96 && peso <= 100) {
            return 'XXL_NO_DISPONIBLE';
        } else if (talla <= 149 && peso <= 49) {
            return 'XS_NO_DISPONIBLE';
        } else {
            return 'FUERA_DE_RANGO';
        }
    };

    // Mostrar el resultado
    const mostrarResultado = (resultado) => {
        let mensaje = '';
        if (resultado === 'XXL_NO_DISPONIBLE') {
            mensaje = 'Al parecer, tu talla es XXL y aún no está disponible en nuestra tienda. ¡Esperamos tenerla pronto!';
        } else if (resultado === 'XS_NO_DISPONIBLE') {
            mensaje = 'Al parecer, tu talla es XS y aún no está disponible en nuestra tienda. ¡Esperamos tenerla pronto!';
        } else if (resultado === 'FUERA_DE_RANGO') {
            mensaje = 'Lo sentimos, tus medidas están fuera del rango de nuestras tallas disponibles.';
        } else {
            mensaje = `Después de analizar tus medidas y estilo, te recomendamos: ${resultado}`;
        }
        setResultado(mensaje);
    };

    // Mostrar errores
    const mostrarError = (mensaje) => {
        setError(mensaje);
    };

    // Limpiar errores
    const clearErrors = () => {
        setError('');
        setResultado('');
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-bg-base">
            <div className="card bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">Recomendador de Tallas</h2>
                <form onSubmit={calcularTalla} className="flex flex-col gap-4">
                    <input
                        type="text"
                        id="talla"
                        placeholder="Talla en cm"
                        value={talla}
                        onChange={(e) => setTalla(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg"
                    />
                    <input
                        type="text"
                        id="peso"
                        placeholder="Peso en kg"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg"
                    />
                    <select
                        id="estilo"
                        value={estilo}
                        onChange={(e) => setEstilo(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg"
                    >
                        <option value="1">Entallado</option>
                        <option value="2">Normal</option>
                        <option value="3">Holgado</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-accent-primary text-white p-2 rounded-md w-full"
                    >
                        Calcular
                    </button>
                </form>
                {resultado && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center">
                        {resultado}
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );

};

export { Tallas };
