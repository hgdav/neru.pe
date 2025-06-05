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
        <div className="p-4 bg-base min-h-screen">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-medium text-gray-800 mb-6 text-center mt-4">
                    Calculadora de Tallas
                </h1>
                <form onSubmit={calcularTalla} className="space-y-6 bg-white p-6 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estatura (cm)
                            </label>
                            <input
                                type="number"
                                value={talla}
                                onChange={(e) => setTalla(e.target.value)}
                                placeholder="Ej: 175"
                                className="w-full p-3 border rounded-lg"
                                min="100"
                                max="250"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                placeholder="Ej: 70"
                                className="w-full p-3 border rounded-lg"
                                min="30"
                                max="200"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estilo preferido
                            </label>
                            <select
                                value={estilo}
                                onChange={(e) => setEstilo(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="1">Entallado</option>
                                <option value="2">Normal</option>
                                <option value="3">Holgado</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mb-6 py-3 px-3 sm:px-4 rounded-xl text-sm bg-primary-button text-white"
                    >
                        Calcular Talla
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg mt-4">
                            ⚠️ {error}
                        </div>
                    )}

                    {resultado && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg mt-4 space-y-2">
                            <p className="font-semibold">🎯 Recomendación:</p>
                            <p>{resultado}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export { Tallas };