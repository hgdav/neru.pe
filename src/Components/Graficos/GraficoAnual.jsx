import React, { useState, useEffect } from 'react';
import { fetchRecordsByYear } from '../../utils/apiFunctions';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const GraficosAnuales = () => {
    // Estados principales
    const [totalEnvios, setTotalEnvios] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [enviosPorTipo, setEnviosPorTipo] = useState({});
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [error, setError] = useState(null);

    // Estados adicionales
    const [monthlyData, setMonthlyData] = useState({
        envios: Array(12).fill(0),
        ventas: Array(12).fill(0),
        registros: Array(12).fill(0),
    });
    const [previousYearData, setPreviousYearData] = useState({
        envios: 0,
        ventas: 0,
        registros: 0,
    });
    const [averageEnvios, setAverageEnvios] = useState(0);
    const [averageVentas, setAverageVentas] = useState(0);
    const [records, setRecords] = useState([]); // Para histogramas y scatter

    // Añadido: Definición de costByTipo como estado
    const [costByTipo, setCostByTipo] = useState({});

    // Añadido: Estados para los datos mensuales del año anterior
    const [previousMonthlyVentas, setPreviousMonthlyVentas] = useState(Array(12).fill(0));

    // Función para limpiar y normalizar texto
    const normalizeText = (text) => {
        return text ? text.trim().toLowerCase() : '';
    };

    useEffect(() => {
        const getRecordsData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Obtener registros del año actual
                const currentYearRecords = await fetchRecordsByYear(year);
                setRecords(currentYearRecords);

                // Obtener registros del año anterior
                const previousYear = year - 1;
                const previousYearRecords = await fetchRecordsByYear(previousYear);

                // Inicializar datos mensuales para el año anterior
                const previousMonthlyVentasTemp = Array(12).fill(0);

                // Procesar datos del año anterior
                previousYearRecords.forEach((record) => {
                    const { costo_pedido, fecha } = record;
                    const ventaAmount = parseFloat(costo_pedido) || 0;
                    const month = fecha.toDate().getMonth(); // 0-11
                    previousMonthlyVentasTemp[month] += ventaAmount;
                });

                setPreviousMonthlyVentas(previousMonthlyVentasTemp);

                setPreviousYearData({
                    envios: previousYearRecords.reduce((sum, r) => sum + parseFloat(r.costo_envio || 0), 0),
                    ventas: previousYearRecords.reduce((sum, r) => sum + parseFloat(r.costo_pedido || 0), 0),
                    registros: previousYearRecords.length,
                });

                // Procesar datos actuales
                const districtCount = {};
                let totalEnviosCost = 0;
                let totalVentasAmount = 0;
                const envioTypeCount = {};
                const monthlyEnvios = Array(12).fill(0);
                const monthlyVentas = Array(12).fill(0);
                const monthlyRegistros = Array(12).fill(0);
                const tempCostByTipo = {}; // Variable temporal para acumular costos por tipo

                currentYearRecords.forEach((record) => {
                    const { distrito, costo_envio, costo_pedido, tipo_envio, fecha_envio } = record;

                    // Normalizar distrito y tipo de envío
                    const normalizedDistrict = normalizeText(distrito);
                    const normalizedEnvioType = normalizeText(tipo_envio);

                    // Contar distritos
                    if (normalizedDistrict) {
                        districtCount[normalizedDistrict] = (districtCount[normalizedDistrict] || 0) + 1;
                    }

                    // Contar tipos de envío
                    if (normalizedEnvioType) {
                        envioTypeCount[normalizedEnvioType] = (envioTypeCount[normalizedEnvioType] || 0) + 1;
                    }

                    // Acumular costos y ventas
                    const envioCost = parseFloat(costo_envio) || 0;
                    const ventaAmount = parseFloat(costo_pedido) || 0;
                    totalEnviosCost += envioCost;
                    totalVentasAmount += ventaAmount;

                    // Acumular mensualmente
                    const month = fecha_envio.toDate().getMonth(); // 0-11
                    monthlyEnvios[month] += envioCost;
                    monthlyVentas[month] += ventaAmount;
                    monthlyRegistros[month] += 1;

                    // Acumular costos por tipo de envío
                    if (normalizedEnvioType) {
                        tempCostByTipo[normalizedEnvioType] = (tempCostByTipo[normalizedEnvioType] || 0) + envioCost;
                    }
                });

                // Actualizar costByTipo en estado
                setCostByTipo(tempCostByTipo);

                // Configurar estados principales
                setTotalEnvios(totalEnviosCost);
                setTotalVentas(totalVentasAmount);
                setTotalRegistros(currentYearRecords.length);
                setEnviosPorTipo(envioTypeCount);
                setMonthlyData({
                    envios: monthlyEnvios,
                    ventas: monthlyVentas,
                    registros: monthlyRegistros,
                });

                // Calcular promedios
                setAverageEnvios(
                    currentYearRecords.length > 0 ? totalEnviosCost / currentYearRecords.length : 0
                );
                setAverageVentas(
                    currentYearRecords.length > 0 ? totalVentasAmount / currentYearRecords.length : 0
                );

                setLoading(false);
            } catch (err) {
                console.error('Error fetching records or calculating data:', err);
                setError('Hubo un problema al cargar los datos.');
                setLoading(false);
            }
        };

        getRecordsData();
    }, [year]);

    // Función para calcular datos acumulados
    const calculateCumulativeData = (data) => {
        let cumulativeSum = 0;
        return data.map((value) => {
            cumulativeSum += value;
            return cumulativeSum;
        });
    };

    const generateBarChartData = () => ({
        labels: ['Gastos de Envío', 'Total de Ventas', 'Total de Registros'],
        datasets: [
            {
                label: `Año ${year}`,
                data: [totalEnvios, totalVentas, totalRegistros],
                backgroundColor: ['#ffddae', '#d3eabc', '#405231'],
            },
        ],
    });

    const generateLineChartData = () => ({
        labels: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        ],
        datasets: [
            {
                label: 'Gastos de Envío',
                data: monthlyData.envios.map(value => value || 0),  // Asegurar que haya un valor (incluso si es 0)
                borderColor: '#ffddae',
                backgroundColor: 'rgba(255, 221, 174, 0.2)',
                fill: true,
                spanGaps: true,  // Permitir que las líneas conecten aunque haya datos faltantes o gaps
            },
            {
                label: 'Total de Ventas',
                data: monthlyData.ventas.map(value => value || 0),  // Asegurar que haya un valor (incluso si es 0)
                borderColor: '#d3eabc',
                backgroundColor: 'rgba(211, 234, 188, 0.2)',
                fill: true,
                spanGaps: true,  // Conectar líneas aunque haya valores de 0
            },
            {
                label: 'Total de Registros',
                data: monthlyData.registros.map(value => value || 0),  // Asegurar que haya un valor (incluso si es 0)
                borderColor: '#405231',
                backgroundColor: 'rgba(64, 82, 49, 0.2)',
                fill: true,
                spanGaps: true,  // Conectar las líneas
            },
        ],
    });


    const generateCostByTypeChartData = () => ({
        labels: Object.keys(enviosPorTipo).map((label) => label.toUpperCase()),
        datasets: [
            {
                label: 'Costo Total de Envío',
                data: Object.keys(enviosPorTipo).map((tipo) => costByTipo[tipo] || 0),
                backgroundColor: ['#f9b52f', '#ebe5d9', '#ea1c23', '#ffddae', '#d3eabc'],
            },
        ],
    });

    // Nueva función para generar el gráfico comparativo de ventas acumuladas entre años
    const generateComparativeAccumulatedSalesData = () => ({
        labels: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        ],
        datasets: [
            {
                label: `Ventas Acumuladas ${year - 1}`,
                data: calculateCumulativeData(previousMonthlyVentas),
                fill: false,
                borderColor: '#ffddae',
                backgroundColor: 'rgba(255, 221, 174, 0.5)',
            },
            {
                label: `Ventas Acumuladas ${year}`,
                data: calculateCumulativeData(monthlyData.ventas),
                fill: false,
                borderColor: '#d3eabc',
                backgroundColor: 'rgba(211, 234, 188, 0.5)',
            },
        ],
    });

    // Calcula el margen de ganancia
    const margen = totalVentas - totalEnvios;

    return (
        <div className="bg-bg-base p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Resumen Anual</h1>

            {/* Selector de Año */}
            <div className="mb-6 flex items-center">
                <label htmlFor="year" className="mr-2 font-semibold">
                    Seleccionar Año:
                </label>
                <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="p-2 border rounded"
                >
                    {/* Generar los últimos 10 años */}
                    {[...Array(2)].map((_, index) => {
                        const y = new Date().getFullYear() - index;
                        return (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        );
                    })}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    {/* Spinner de carga */}
                    <div className="text-gray-600">Graficando...</div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* Indicadores Clave de Rendimiento (KPI) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-input-bg rounded-3xl text-center">
                            <h3 className="text-lg font-semibold">Crecimiento de Ventas</h3>
                            <p
                                className={`text-2xl ${previousYearData.ventas > 0 &&
                                    ((totalVentas - previousYearData.ventas) / previousYearData.ventas) * 100 >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}
                            >
                                {previousYearData.ventas > 0
                                    ? (
                                        ((totalVentas - previousYearData.ventas) / previousYearData.ventas) *
                                        100
                                    ).toFixed(2)
                                    : 'N/A'}
                                %
                            </p>
                        </div>
                        <div className="p-4 bg-input-bg rounded-3xl text-center">
                            <h3 className="text-lg font-semibold">Costo Promedio por Envío</h3>
                            <p className="text-2xl text-red-600">S/ {averageEnvios.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-input-bg rounded-3xl text-center">
                            <h3 className="text-lg font-semibold">Venta Promedio</h3>
                            <p className="text-2xl text-green-600">S/ {averageVentas.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Margen de Ganancia Anual */}
                    <div className="p-4 bg-input-bg rounded-3xl text-center flex justify-center items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Margen de Ganancia Anual (Ventas - Envíos)</h3>
                            <p
                                className={`text-3xl font-bold ${margen >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                S/ {margen.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Gráficos de Totales Anuales y Tendencias Mensuales */}
                    <div className="p-4 bg-input-bg rounded-3xl flex flex-wrap justify-center items-center">
                        <div className="w-full md:w-1/2 p-2">
                            <div className="p-4 bg-input-bg rounded-3xl">
                                <h2 className="text-xl font-semibold mb-4 text-center">Totales Anuales</h2>
                                <Bar data={generateBarChartData()} />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-2">
                            <div className="p-4 bg-input-bg rounded-3xl">
                                <h2 className="text-xl font-semibold mb-4 text-center">Tendencias Mensuales</h2>
                                <Line data={generateLineChartData()} />
                            </div>
                        </div>
                    </div>

                    {/* Gráficos de Distribución de Costos y Ventas Acumuladas Comparativas */}
                    <div className="p-4 bg-input-bg rounded-3xl flex flex-wrap justify-center items-center">
                        <div className="w-full md:w-1/2 p-2">
                            <div className="p-4 bg-input-bg rounded-3xl">
                                <h2 className="text-xl font-semibold mb-4 text-center">
                                    Distribución de Costos por Tipo de Envío
                                </h2>
                                <Bar data={generateCostByTypeChartData()} />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-2">
                            <div className="p-4 bg-input-bg rounded-3xl">
                                <h2 className="text-xl font-semibold mb-4 text-center">
                                    Ventas Acumuladas Comparativas
                                </h2>
                                <Line data={generateComparativeAccumulatedSalesData()} />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Resumen con Detalles Clave */}
                    <div className="p-4 bg-input-bg rounded-3xl">
                        <h2 className="text-xl font-semibold mb-4">Resumen Detallado de Couriers</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Tipo de Envío</th>
                                        <th className="py-2 px-4 border-b border-r">Total Envíos</th>
                                        <th className="py-2 px-4 border-b">Ventas Totales</th>
                                        <th className="py-2 px-4 border-b">Costo Total de Envío</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(enviosPorTipo).map((tipo, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="py-2 px-4 border-b">{tipo.toUpperCase()}</td>
                                            <td className="py-2 px-4 border-b border-r">{enviosPorTipo[tipo]}</td>
                                            <td className="py-2 px-4 border-b">
                                                S/{' '}
                                                {records
                                                    .filter(
                                                        (r) => normalizeText(r.tipo_envio) === tipo
                                                    )
                                                    .reduce(
                                                        (sum, r) =>
                                                            sum +
                                                            parseFloat(r.costo_pedido || 0),
                                                        0
                                                    )
                                                    .toFixed(2)}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                S/{' '}
                                                {records
                                                    .filter(
                                                        (r) => normalizeText(r.tipo_envio) === tipo
                                                    )
                                                    .reduce(
                                                        (sum, r) =>
                                                            sum +
                                                            parseFloat(r.costo_envio || 0),
                                                        0
                                                    )
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GraficosAnuales;
