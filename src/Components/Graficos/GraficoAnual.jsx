import React, { useState, useEffect, useCallback } from 'react';
import { fetchRecordsByYear, fetchAvailableYears } from '../../utils/apiFunctions';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const GraficosAnuales = () => {
    const [yearData, setYearData] = useState({
        totalEnvios: 0,
        totalVentas: 0,
        totalRegistros: 0,
        monthlyEnvios: Array(12).fill(0),
        monthlyVentas: Array(12).fill(0),
        giftPackaging: Array(12).fill(0),
        costByTipo: {},
        costosMensualesPorCourier: {}
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
            costosMensualesPorCourier: {}
        };

        const costByTipo = {};

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

            // Procesar costos por tipo de courier
            if (tipoEnvio) {
                costByTipo[tipoEnvio] = (costByTipo[tipoEnvio] || 0) + costoEnvio;

                // Procesar costos mensuales por courier
                if (!monthlyData.costosMensualesPorCourier[tipoEnvio]) {
                    monthlyData.costosMensualesPorCourier[tipoEnvio] = Array(12).fill(0);
                }
                monthlyData.costosMensualesPorCourier[tipoEnvio][month] += costoEnvio;
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
                costosMensualesPorCourier: monthlyData.costosMensualesPorCourier
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

    if (loading) return <div className="p-6 text-center">Cargando datos...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold">Reporte Anual {year}</h1>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="p-2 border rounded-lg w-full md:w-64"
                >
                    {availableYears.sort((a, b) => b - a).map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPIBox
                    title="Ventas Totales"
                    value={yearData.totalVentas}
                    currency
                    comparison={previousYearData.monthlyVentas.reduce((a, b) => a + b, 0)}
                />
                <KPIBox
                    title="Costos de Envío"
                    value={yearData.totalEnvios}
                    currency
                    comparison={previousYearData.monthlyEnvios.reduce((a, b) => a + b, 0)}
                />
                <KPIBox
                    title="Pedidos"
                    value={yearData.totalRegistros}
                    comparison={previousYearData.monthlyVentas.length}
                />
                <KPIBox
                    title="Empaques Regalo"
                    value={yearData.giftPackaging.reduce((a, b) => a + b, 0)}
                    comparison={0}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <ChartCard title="Gastos de Envío por Courier (Mensual)">
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
            </div>
        </div>
    );
};

const KPIBox = ({ title, value, currency = false, comparison }) => {
    const difference = value - comparison;
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <div className="text-2xl font-bold">
                {currency ? 'S/ ' : ''}{value.toFixed(2)}
            </div>
            {comparison !== undefined && comparison !== 0 && (
                <div className={`text-xs mt-1 ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {difference >= 0 ? '▲' : '▼'} {Math.abs(difference).toFixed(2)} vs anterior
                </div>
            )}
        </div>
    );
};

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
);

export default GraficosAnuales;