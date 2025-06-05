import React, { useState, useEffect, useCallback } from 'react';
import { fetchRecordsByYear, fetchAvailableYears } from '../../utils/apiFunctions';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import LoadingAnual from './LoadingAnual';

const GraficosAnuales = () => {
    const [yearData, setYearData] = useState({
        totalEnvios: 0,
        totalVentas: 0,
        totalRegistros: 0,
        monthlyEnvios: Array(12).fill(0),
        monthlyVentas: Array(12).fill(0),
        giftPackaging: Array(12).fill(0),
        costByTipo: {},
        countByTipo: {},
        costosMensualesPorCourier: {},
        enviosMensualesPorCourier: {} // Nuevo estado añadido
    });

    const [previousYearData, setPreviousYearData] = useState({
        monthlyVentas: Array(12).fill(0),
        monthlyEnvios: Array(12).fill(0)
    });

    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [error, setError] = useState(null);

    const normalizeText = useCallback((text) => text ? text.trim().toLowerCase() : '', []);

    const processRecords = useCallback((records, isPreviousYear = false) => {
        const monthlyData = {
            envios: Array(12).fill(0),
            ventas: Array(12).fill(0),
            giftPackaging: Array(12).fill(0),
            costosMensualesPorCourier: {},
            enviosMensualesPorCourier: {} // Nuevo dato procesado
        };

        const costByTipo = {};
        const countByTipo = {};

        records.forEach(record => {
            const month = record.fecha_envio.toDate().getMonth();
            const tipoEnvio = normalizeText(record.tipo_envio);
            const costoEnvio = parseFloat(record.costo_envio) || 0;
            const costoPedido = parseFloat(record.costo_pedido) || 0;

            // Procesar datos mensuales generales
            monthlyData.envios[month] += costoEnvio;
            monthlyData.ventas[month] += costoPedido;

            if (record.empaque_regalo) {
                monthlyData.giftPackaging[month] += 1;
            }

            // Procesar costos y conteos por tipo de courier
            if (tipoEnvio) {
                // Costos totales
                costByTipo[tipoEnvio] = (costByTipo[tipoEnvio] || 0) + costoEnvio;

                // Conteo total de envíos
                countByTipo[tipoEnvio] = (countByTipo[tipoEnvio] || 0) + 1;

                // Costos mensuales por courier
                if (!monthlyData.costosMensualesPorCourier[tipoEnvio]) {
                    monthlyData.costosMensualesPorCourier[tipoEnvio] = Array(12).fill(0);
                }
                monthlyData.costosMensualesPorCourier[tipoEnvio][month] += costoEnvio;

                // Envíos mensuales por courier (nuevo)
                if (!monthlyData.enviosMensualesPorCourier[tipoEnvio]) {
                    monthlyData.enviosMensualesPorCourier[tipoEnvio] = Array(12).fill(0);
                }
                monthlyData.enviosMensualesPorCourier[tipoEnvio][month] += 1;
            }
        });

        if (isPreviousYear) {
            setPreviousYearData({
                monthlyVentas: monthlyData.ventas,
                monthlyEnvios: monthlyData.envios
            });
        } else {
            setYearData({
                totalEnvios: monthlyData.envios.reduce((a, b) => a + b, 0),
                totalVentas: monthlyData.ventas.reduce((a, b) => a + b, 0),
                totalRegistros: records.length,
                monthlyEnvios: monthlyData.envios,
                monthlyVentas: monthlyData.ventas,
                giftPackaging: monthlyData.giftPackaging,
                costByTipo: costByTipo,
                countByTipo: countByTipo,
                costosMensualesPorCourier: monthlyData.costosMensualesPorCourier,
                enviosMensualesPorCourier: monthlyData.enviosMensualesPorCourier // Nuevo dato
            });
        }
    }, [normalizeText]);

    useEffect(() => {
        const initializeYears = async () => {
            try {
                const years = await fetchAvailableYears();
                setAvailableYears(years);
                if (years.length > 0 && !years.includes(year)) {
                    setYear(Math.max(...years));
                }
            } catch (error) {
                setError('Error cargando años disponibles');
            }
        };
        initializeYears();
    }, [year]);

    useEffect(() => {
        const loadData = async () => {
            if (!availableYears.includes(year)) return;

            try {
                setLoading(true);
                const [current, previous] = await Promise.all([
                    fetchRecordsByYear(year),
                    fetchRecordsByYear(year - 1)
                ]);

                processRecords(current);
                processRecords(previous, true);
                setLoading(false);
            } catch (error) {
                setError('Error cargando datos: ' + error.message);
                setLoading(false);
            }
        };

        loadData();
    }, [year, availableYears, processRecords]);

    const gastosEnvioPorCourierMensual = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: Object.entries(yearData.costosMensualesPorCourier).map(([courier, datos], index) => ({
            label: courier.toUpperCase(),
            data: datos,
            borderColor: `hsl(${index * 90}, 70%, 50%)`,
            tension: 0.3,
            fill: false
        }))
    };

    const enviosPorCourierMensual = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: Object.entries(yearData.enviosMensualesPorCourier).map(([courier, datos], index) => ({
            label: courier.toUpperCase(),
            data: datos,
            borderColor: `hsl(${index * 90}, 70%, 50%)`,
            tension: 0.3,
            fill: false
        }))
    };

    if (loading) return <LoadingAnual />;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 space-y-8 bg-base">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-medium">Reporte Anual {year} 📊📊📊</h1>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="p-2 border border-solid border-black bg-bg-base rounded-lg w-full md:w-64"
                >
                    {availableYears.sort((a, b) => b - a).map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPIBox
                    title="Ventas Totales (Anual)"
                    value={yearData.totalVentas}
                    currency
                    comparison={previousYearData.monthlyVentas.reduce((a, b) => a + b, 0)}
                />
                <KPIBox
                    title="Costos de Envío (Anual)"
                    value={yearData.totalEnvios}
                    currency
                    comparison={previousYearData.monthlyEnvios.reduce((a, b) => a + b, 0)}
                />
                <KPIBox
                    title="Pedidos (Anual)"
                    value={yearData.totalRegistros}
                    comparison={previousYearData.monthlyVentas.length}
                />
                <KPIBox
                    title="Empaques Regalo (Anual)"
                    value={yearData.giftPackaging.reduce((a, b) => a + b, 0)}
                    comparison={0}
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-medium mb-4">Tendencias por meses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    <ChartCard title="Empaques de Regalo">
                        <Bar data={{
                            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                            datasets: [{
                                label: 'Empaques',
                                data: yearData.giftPackaging,
                                backgroundColor: '#10B981'
                            }]
                        }} />
                    </ChartCard>

                    <ChartCard title="Gastos de Envío por Courier">
                        <Line
                            data={gastosEnvioPorCourierMensual}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Costo total (S/)'
                                        }
                                    }
                                }
                            }}
                        />
                    </ChartCard>

                    {/* Nuevo gráfico de cantidad de envíos por courier */}
                    <ChartCard title="Cantidad de Envíos por Courier">
                        <Line
                            data={enviosPorCourierMensual}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            precision: 0
                                        },
                                        title: {
                                            display: true,
                                            text: 'Cantidad de envíos'
                                        }
                                    }
                                }
                            }}
                        />
                    </ChartCard>
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-medium mb-4">Consolidado Anual</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    <ChartCard title="Comparativo de Ventas">
                        <Line data={{
                            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                            datasets: [
                                {
                                    label: `Ventas ${year}`,
                                    data: yearData.monthlyVentas,
                                    borderColor: '#3B82F6',
                                    tension: 0.3
                                },
                                {
                                    label: `Ventas ${year - 1}`,
                                    data: previousYearData.monthlyVentas,
                                    borderColor: '#94A3B8',
                                    tension: 0.3
                                }
                            ]
                        }} />
                    </ChartCard>

                    <ChartCard title="Costos por Courier">
                        <Bar data={{
                            labels: Object.keys(yearData.costByTipo).map(t => t.toUpperCase()),
                            datasets: [{
                                label: 'Costos',
                                data: Object.values(yearData.costByTipo),
                                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
                            }]
                        }} />
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

const KPIBox = ({ title, value, currency = false, comparison }) => {
    const difference = value - comparison;
    return (
        <div className="border p-4 rounded-3xl bg-base-white">
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <div className="text-2xl font-bold">
                {currency ? 'S/ ' : ''}{value.toFixed(2)}
            </div>
            {comparison !== undefined && comparison !== 0 && (
                <div className={`text-xs mt-1 ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {difference >= 0 ? '▲' : '▼'} S/. {Math.abs(difference).toFixed(2)} que el año anterior
                </div>
            )}
        </div>
    );
};

const ChartCard = ({ title, children }) => (
    <div className="border p-4 rounded-3xl bg-base-white">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
);

export default GraficosAnuales;