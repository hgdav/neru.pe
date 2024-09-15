import React, { useState, useEffect } from 'react';
import { fetchRecords } from '../../utils/apiFunctions';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import MonthNavigator from '../RegistroClientes/MonthNavigator';  // Importa tu MonthNavigator

const Graficos = () => {
    const [mostFrequentDistrict, setMostFrequentDistrict] = useState('');
    const [totalEnvios, setTotalEnvios] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [enviosPorTipo, setEnviosPorTipo] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const getRecordsData = async () => {
            setLoading(true);
            try {
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();

                // Obtener registros del mes actual
                const records = await fetchRecords(month, year);

                const districtCount = {};
                let totalEnviosCost = 0;
                let totalVentasAmount = 0;
                const envioTypeCount = {};

                records.forEach((record) => {
                    const { distrito, costo_envio, costo_pedido, tipo_envio } = record;

                    if (districtCount[distrito]) {
                        districtCount[distrito]++;
                    } else {
                        districtCount[distrito] = 1;
                    }

                    totalEnviosCost += costo_envio || 0;
                    totalVentasAmount += costo_pedido || 0;

                    if (envioTypeCount[tipo_envio]) {
                        envioTypeCount[tipo_envio]++;
                    } else {
                        envioTypeCount[tipo_envio] = 1;
                    }
                });

                const sortedDistricts = Object.entries(districtCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);

                setMostFrequentDistrict(sortedDistricts);
                setTotalEnvios(totalEnviosCost);
                setTotalVentas(totalVentasAmount);
                setTotalRegistros(records.length);
                setEnviosPorTipo(envioTypeCount);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching records or calculating data:', error);
                setLoading(false);
            }
        };

        getRecordsData();
    }, [currentDate]);

    const handleMonthChange = (newDate) => {
        setCurrentDate(newDate); // Cambia el mes y año al seleccionar otro mes
    };

    const generatePieChartData = () => ({
        labels: Object.keys(enviosPorTipo),
        datasets: [
            {
                data: Object.values(enviosPorTipo),
                backgroundColor: [
                    '#bb5c39',  // accent-primary
                    '#8888dc',  // accent-secondary
                    '#c4c3bb',  // accent-muted
                    '#d4a37f',  // accent-warm
                ],
                hoverBackgroundColor: [
                    '#bb5c39',  // accent-primary
                    '#8888dc',  // accent-secondary
                    '#c4c3bb',  // accent-muted
                    '#d4a37f',  // accent-warm
                ],
            },
        ],
    });

    const generateBarChartData = () => ({
        labels: ['Gastos de Envío', 'Total de Ventas', 'Total de Registros'],
        datasets: [
            {
                label: 'Montos',
                data: [totalEnvios, totalVentas, totalRegistros],
                backgroundColor: ['#bb5c39', '#8888dc', '#d4a37f'],
            },
        ],
    });

    return (
        <div className="bg-base-lg p-6">
            {/* Navegador de Meses */}
            <MonthNavigator
                currentMonth={currentDate.getMonth()}
                currentYear={currentDate.getFullYear()}
                onMonthChange={handleMonthChange}
            />

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    {/* Total de envíos, ventas y registros (Ocupa toda la fila) */}
                    <div className="p-4 bg-gray-100 rounded-lg w-full h-full">
                        <h2 className="text-xl font-semibold">Totales</h2>
                        <div className="h-64 w-full">
                            <Bar data={generateBarChartData()} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top 5 distritos con más envíos */}
                        <div className="p-4 bg-gray-100 rounded-lg w-full h-full">
                            <h2 className="text-xl font-semibold">Top 5 Distritos con más envíos</h2>
                            <ul className="mt-4">
                                {mostFrequentDistrict.map(([district, count], index) => (
                                    <li key={district} className="flex justify-between text-lg">
                                        <span>{index + 1}. {district}</span>
                                        <span>{count} envíos</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Gráfico de tipos de envío */}
                        <div className="p-4 bg-gray-100 rounded-lg w-full h-full">
                            <h2 className="text-xl font-semibold">Registros según tipo de envío</h2>
                            <div className="h-64 w-full">
                                <Pie data={generatePieChartData()} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Graficos;
