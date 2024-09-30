import React, { useState, useEffect } from 'react';
import { fetchRecords } from '../../utils/apiFunctions';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import MonthNavigator from '../RegistroClientes/MonthNavigator';

const Graficos = () => {
    const [mostFrequentDistrict, setMostFrequentDistrict] = useState([]);
    const [totalEnvios, setTotalEnvios] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [enviosPorTipo, setEnviosPorTipo] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Función para limpiar y normalizar texto
    const normalizeText = (text) => {
        return text ? text.trim().toLowerCase() : '';
    };

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

                    // Normalizar distrito y tipo de envío
                    const normalizedDistrict = normalizeText(distrito);
                    const normalizedEnvioType = normalizeText(tipo_envio);

                    // Contar distritos
                    if (normalizedDistrict) {
                        if (districtCount[normalizedDistrict]) {
                            districtCount[normalizedDistrict]++;
                        } else {
                            districtCount[normalizedDistrict] = 1;
                        }
                    }

                    // Convertir costos a números y acumular
                    const envioCost = parseFloat(costo_envio);
                    if (!isNaN(envioCost)) {
                        totalEnviosCost += envioCost;
                    }

                    const ventaAmount = parseFloat(costo_pedido);
                    if (!isNaN(ventaAmount)) {
                        totalVentasAmount += ventaAmount;
                    }

                    // Contar tipos de envío
                    if (normalizedEnvioType) {
                        if (envioTypeCount[normalizedEnvioType]) {
                            envioTypeCount[normalizedEnvioType]++;
                        } else {
                            envioTypeCount[normalizedEnvioType] = 1;
                        }
                    }
                });


                // Ordenar distritos por más frecuentes y limitar a los top 5
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
        setCurrentDate(newDate);
    };

    const generatePieChartData = () => ({
        labels: Object.keys(enviosPorTipo),
        datasets: [
            {
                data: Object.values(enviosPorTipo),
                backgroundColor: [
                    '#f9b52f',
                    '#ebe5d9',
                    '#ea1c23',
                    '#ffddae',
                ],
                hoverBackgroundColor: [
                    '#f9b52f',
                    '#ebe5d9',
                    '#ea1c23',
                    '#ffddae',
                ],
            },
        ],
    });

    const generateBarChartData = () => {
        const data = [totalEnvios, totalVentas, totalRegistros];

        return {
            labels: ['Gastos de Envío', 'Total de Ventas', 'Total de Registros'],
            datasets: [
                {
                    label: 'Cantidad',
                    data: data,
                    backgroundColor: ['#ffddae', '#d3eabc', '#405231'],
                },
            ],
        };
    };

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
                    {/* Total de envíos, ventas y registros */}
                    <div className="p-4 bg-input-bg rounded-lg w-full h-full">
                        <h2 className="text-xl font-semibold">Totales</h2>
                        <div className="h-64 w-full">
                            <Bar data={generateBarChartData()} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top 5 distritos con más envíos */}
                        <div className="p-4 bg-bg-base-white rounded-lg w-full h-full">
                            <h2 className="text-xl font-semibold">Top 5 Distritos con más envíos</h2>
                            <ul className="mt-4">
                                {mostFrequentDistrict.map(([district, count], index) => (
                                    <li key={district} className="flex justify-between text-lg">
                                        <span>{index + 1}. {district.toUpperCase()}</span>
                                        <span>{count} envíos</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Gráfico de tipos de envío */}
                        <div className="p-4 bg-input-bg rounded-lg w-full h-full">
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
