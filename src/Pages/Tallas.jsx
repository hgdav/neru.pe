import React, { useState } from 'react';

const Tallas = () => {
    const [talla, setTalla] = useState('');
    const [peso, setPeso] = useState('');
    const [estilo, setEstilo] = useState('2');
    const [resultado, setResultado] = useState('');
    const [error, setError] = useState('');

    const calcularTalla = (event) => {
        event.preventDefault();
        setError('');
        setResultado('');

        try {
            const altura = validarCampo('estatura', talla, 100, 250);
            const pesoValido = validarCampo('peso', peso, 30, 200);
            const estiloValido = validarEstilo(estilo);

            const tallaRecomendada = calcularTallaBase(altura, pesoValido, estiloValido);
            mostrarResultado(tallaRecomendada, altura, pesoValido);

        } catch (error) {
            setError(error.message);
        }
    };

    const validarCampo = (nombre, valor, min, max) => {
        const valorNum = Number(valor);
        if (isNaN(valorNum)) throw new Error(`${nombre} debe ser un número`);
        if (valorNum < min || valorNum > max) throw new Error(
            `${nombre} válido: ${min}-${max} (Ej: ${Math.round((min + max) / 2)})`
        );
        return valorNum;
    };

    const validarEstilo = (valor) => {
        if (!['1', '2', '3'].includes(valor)) throw new Error('Estilo no válido');
        return valor;
    };

    const calcularTallaBase = (alturaCm, pesoKg, estiloPrenda) => {
        const alturaMetros = alturaCm / 100;
        const bmi = pesoKg / (alturaMetros * alturaMetros);

        let tallaBase;
        if (bmi < 18.5) tallaBase = 'S';
        else if (bmi >= 18.5 && bmi < 22) tallaBase = 'M';
        else if (bmi >= 22 && bmi < 26) tallaBase = 'L';
        else if (bmi >= 26 && bmi < 30) tallaBase = 'XL';
        else tallaBase = 'XXL';

        const ajustesEstilo = {
            '1': { S: 'S', M: 'S', L: 'M', XL: 'L', XXL: 'XL' },
            '2': tallaBase,
            '3': { S: 'M', M: 'L', L: 'XL', XL: 'XL', XXL: 'XXL' }
        };

        const tallaFinal = typeof ajustesEstilo[estiloPrenda] === 'object'
            ? ajustesEstilo[estiloPrenda][tallaBase]
            : ajustesEstilo[estiloPrenda];

        if (tallaFinal === 'XXL') return 'XXL_NO_DISPONIBLE';
        if (tallaFinal === 'XS') return 'XS_NO_DISPONIBLE';

        return `TALLA ${tallaFinal}`;
    };

    const mostrarResultado = (tallaResultado, altura, peso) => {
        const estilos = {
            '1': 'Entallado',
            '2': 'Normal',
            '3': 'Holgado'
        };

        const mensajes = {
            'XXL_NO_DISPONIBLE': `Recomendación: XXL (próximamente) para ${altura}cm/${peso}kg`,
            'XS_NO_DISPONIBLE': `Recomendación: XS (próximamente) para ${altura}cm/${peso}kg`,
            'FUERA_DE_RANGO': `Consulta especial requerida para ${altura}cm/${peso}kg`
        };

        setResultado(mensajes[tallaResultado] ||
            `Para ${altura}cm y ${peso}kg con estilo ${estilos[estilo]}:\nTalla recomendada:${tallaResultado}`);
    };
    return (
        <div className="p-4 bg-bg-base min-h-screen">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Calculadora de Tallas
                </h1>

                <form onSubmit={calcularTalla} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1">Entallado</option>
                                <option value="2">Normal</option>
                                <option value="3">Holgado</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mb-6 py-3 px-3 sm:px-4 rounded-xl text-sm bg-accent-secondary text-accent-secondary-dark transition-colors 
 whitespace-nowrap"
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