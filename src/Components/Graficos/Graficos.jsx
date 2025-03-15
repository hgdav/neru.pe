import React, { useState, useEffect } from 'react';
import { fetchRecords } from '../../utils/apiFunctions';
import { Pie } from 'react-chartjs-2';
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
                const records = await fetchRecords(month, year);

                const districtCount = {};
                let totalEnviosCost = 0;
                let totalVentasAmount = 0;
                const envioTypeCount = {};

                records.forEach((record) => {
                    const { distrito, costo_envio, costo_pedido, tipo_envio } = record;
                    const normalizedDistrict = normalizeText(distrito);
                    const normalizedEnvioType = normalizeText(tipo_envio);

                    if (normalizedDistrict) {
                        districtCount[normalizedDistrict] = (districtCount[normalizedDistrict] || 0) + 1;
                    }

                    totalEnviosCost += parseFloat(costo_envio) || 0;
                    totalVentasAmount += parseFloat(costo_pedido) || 0;

                    if (normalizedEnvioType) {
                        envioTypeCount[normalizedEnvioType] = (envioTypeCount[normalizedEnvioType] || 0) + 1;
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
                console.error('Error:', error);
                setLoading(false);
            }
        };

        getRecordsData();
    }, [currentDate]);

    const handleMonthChange = (newDate) => {
        setCurrentDate(newDate);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const generatePieChartData = () => ({
        labels: Object.keys(enviosPorTipo),
        datasets: [{
            data: Object.values(enviosPorTipo),
            backgroundColor: ['#a3c4f3', '#f2b8d6', '#c2e0b4', '#ffd7a3', '#e8c3f7', '#b9e4dd'],
            hoverBackgroundColor: ['#a3c4f3', '#f2b8d6', '#c2e0b4', '#ffd7a3', '#e8c3f7', '#b9e4dd'],
        }],
    });

    return (
        <div className="bg-bg-base sm:px-6 py-1 px-2">
            <div className="flex justify-between items-center mb-4">
                <MonthNavigator
                    currentMonth={currentDate.getMonth()}
                    currentYear={currentDate.getFullYear()}
                    onMonthChange={handleMonthChange}
                />
                <Link to="/resumen" className="bg-bg-base-white text-accent-secondary rounded-lg p-1">
                    <MdInsertChartOutlined size={24} />
                </Link>
            </div>

            {loading ? (
                <p className="text-center py-8">Graficando...</p>
            ) : (
                <div className="space-y-6">
                    {/* Sección de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Gastos de envío</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(totalEnvios)}
                                    </p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full ml-3">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ventas totales</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(totalVentas)}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total registros</p>
                                    <p className="text-2xl font-bold text-black-600">
                                        {totalRegistros.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-full ml-3">
                                    <svg className="w-5 h-5 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Gráficos y Distritos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Distritos más frecuentes</h2>
                            <div className="space-y-3">
                                {mostFrequentDistrict.map(([district, count]) => (
                                    <div key={district} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        {/* Texto con truncado y efecto de desvanecimiento */}
                                        <span className="font-medium capitalize flex-1 truncate max-w-[70%]">
                                            {district}
                                        </span>

                                        {/* Contador con forma circular fija */}
                                        <span className="bg-accent-secondary text-accent-secondary-dark px-3 py-1 rounded-full text-sm shrink-0">
                                            {count} envíos
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-center">Tipos de envío</h2>
                            <div className="h-72">
                                <Pie
                                    data={generatePieChartData()}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    padding: 20
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Graficos;