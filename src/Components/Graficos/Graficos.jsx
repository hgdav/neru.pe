import React, { useState, useEffect } from 'react';
import { fetchRecords } from '../../utils/apiFunctions';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import MonthNavigator from '../RegistroClientes/MonthNavigator';
import { Link } from 'react-router-dom';
import { MdInsertChartOutlined } from "react-icons/md";

const Graficos = () => {
    const [mostFrequentDistrict, setMostFrequentDistrict] = useState([]);
    const [totalEnvios, setTotalEnvios] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [enviosPorTipo, setEnviosPorTipo] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

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

                    const envioCost = parseFloat(costo_envio);
                    if (!isNaN(envioCost)) {
                        totalEnviosCost += envioCost;
                    }

                    const ventaAmount = parseFloat(costo_pedido);
                    if (!isNaN(ventaAmount)) {
                        totalVentasAmount += ventaAmount;
                    }

                    if (normalizedEnvioType) {
                        if (envioTypeCount[normalizedEnvioType]) {
                            envioTypeCount[normalizedEnvioType]++;
                        } else {
                            envioTypeCount[normalizedEnvioType] = 1;
                        }
                    }
                });


                const sortedDistricts = Object.entries(districtCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10);

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
                    '#a3c4f3',
                    '#f2b8d6',
                    '#c2e0b4',
                    '#ffd7a3',
                    '#e8c3f7',
                    '#b9e4dd'
                ],
                hoverBackgroundColor: [
                    '#a3c4f3',
                    '#f2b8d6',
                    '#c2e0b4',
                    '#ffd7a3',
                    '#e8c3f7',
                    '#b9e4dd'
                ],
            },
        ],
    });

    const generateBarChartData = () => {
        const data = [totalEnvios, totalVentas, totalRegistros];

        return {
            labels: ['Gastos Envío', 'Ventas', 'Cantidad Registros'],
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
        <div className="bg-bg-base px-6 py-1">
            {/* Navegador de Meses */}
            <div className="flex justify-between items-center mb-4">
                <MonthNavigator
                    currentMonth={currentDate.getMonth()}
                    currentYear={currentDate.getFullYear()}
                    onMonthChange={handleMonthChange}
                />
                <Link to="/resumen" className="bg-bg-base-white text-accent-secondary rounded-lg flex-end p-1 float-right">
                    <MdInsertChartOutlined size={24} />
                </Link>
            </div>
            {loading ? (
                <p>Graficando...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    <div className="p-4 bg-base rounded-lg w-full h-full">
                        <h2 className="text-xl text-center font-semibold sm:text-center lg:text-left">Resumen de ventas y gastos</h2>
                        <div className="h-72 w-full sm:h-64 lg:h-72">
                            <Bar data={generateBarChartData()} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-bg-base-white rounded-3xl w-full h-full">
                            <h2 className="text-xl font-semibold">Distritos con más envíos</h2>
                            <ul className="mt-4">
                                {mostFrequentDistrict.map(([district, count]) => (
                                    <li key={district} className="flex justify-between items-center text-md border-b-2 border-gray-200">
                                        <span className='border-accent-primary flex-1 text-left'> {district.toUpperCase()}</span>
                                        <span className='flex-1 text-right'>{count} envíos</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-4 bg-bg-base rounded-lg w-full h-full">
                            <h2 className="text-xl font-semibold text-center">Registros según tipo de envío</h2>
                            <div className="h-70 w-full flex justify-center">
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
