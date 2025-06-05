import React, { useState, useEffect } from 'react';
import { fetchRecords } from '../../utils/apiFunctions';
import 'chart.js/auto';
import MonthNavigator from '../RegistroClientes/MonthNavigator';
import { Link } from 'react-router-dom';
import { MdInsertChartOutlined, MdMoreVert } from "react-icons/md";
import Calendario from '../Calendario/Calendario';

const Graficos = () => {
    const [totalEnvios, setTotalEnvios] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mostrarOpciones, setMostrarOpciones] = useState(false);
    const [variacionEnvios, setVariacionEnvios] = useState(0);
    const [variacionVentas, setVariacionVentas] = useState(0);
    const [variacionRegistros, setVariacionRegistros] = useState(0);
    const [mostFrequentDistrict, setMostFrequentDistrict] = useState([]);

    const normalizeText = (text) => {
        return text ? text.trim().toLowerCase() : '';
    };

    useEffect(() => {
        const getRecordsData = async () => {
            setLoading(true);
            try {
                // Mes y año actuales
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();

                // Mes anterior
                const prevMonthDate = new Date(currentDate);
                prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
                const prevMonth = prevMonthDate.getMonth();
                const prevMonthYear = prevMonthDate.getFullYear();

                // 1) Registros del mes actual
                const recordsCurrentMonth = await fetchRecords(month, year);

                // 2) Registros del mes anterior
                const recordsPreviousMonth = await fetchRecords(prevMonth, prevMonthYear);

                // Contar distritos del mes actual
                const districtCount = {};
                recordsCurrentMonth.forEach(record => {
                    const distrito = normalizeText(record.distrito);
                    if (distrito) {
                        districtCount[distrito] = (districtCount[distrito] || 0) + 1;
                    }
                });

                // Ordenar y obtener top 5
                const sortedDistricts = Object.entries(districtCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);

                setMostFrequentDistrict(sortedDistricts);

                // Procesar registros para métricas financieras
                const processRecords = (records) => {
                    let envios = 0;
                    let ventas = 0;
                    let registros = records.length;

                    records.forEach(record => {
                        envios += parseFloat(record.costo_envio) || 0;
                        ventas += parseFloat(record.costo_pedido) || 0;
                    });

                    return { envios, ventas, registros };
                };

                const current = processRecords(recordsCurrentMonth);
                const previous = processRecords(recordsPreviousMonth);

                // Calcular porcentajes
                const calcularVariacion = (actual, anterior) => {
                    if (anterior === 0) return actual > 0 ? 100 : 0;
                    return ((actual - anterior) / anterior) * 100;
                };

                setTotalEnvios(current.envios);
                setTotalVentas(current.ventas);
                setTotalRegistros(current.registros);

                setVariacionEnvios(calcularVariacion(current.envios, previous.envios));
                setVariacionVentas(calcularVariacion(current.ventas, previous.ventas));
                setVariacionRegistros(calcularVariacion(current.registros, previous.registros));

            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
        };

        getRecordsData();
    }, [currentDate]);

    // Para cambiar el mes/año con MonthNavigator
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

    const fecha = new Date();
    const diaSemana = fecha.getDate();
    const mesActual = document.getElementById('mes-actual')?.textContent;

    const IndicadorPorcentaje = ({ valor }) => {
        const esPositivo = valor >= 0;
        const icono = esPositivo ? '▲' : '▼';

        return (
            <div className={`flex items-center gap-1 border rounded-lg p-1 text-sm ${esPositivo ? 'border-green-600 text-green-600 bg-green-50' : 'border-red-600 text-red-600 bg-red-50'}`} title="Con respecto al mes anterior">
                <span>{Math.abs(valor).toFixed(1)}%</span>
                <span>{icono}</span>
            </div>
        );
    };
    return (
        <div className="sm:px-6 py-1 px-2">
            {/* Calendario primero en mobile */}
            <div className="lg:hidden mb-4 bg-base-white rounded-3xl">
                <div className="h-full p-4">
                    <Calendario />
                </div>
            </div>

            {/* Encabezado: Resumen del mes */}
            <div className="flex items-center justify-between pb-4 border-b-0 md:border-b border-gray-200 bg-base-white p-6 rounded-t-3xl">
                <div className="flex flex-col text-left">
                    <h2 className="text-xl md:text-2xl hidden md:block">Resumen del mes</h2>
                    <h2 className='text-xl md:text-2xl block md:hidden'>Resumen</h2>
                    <p className="text-sm text-gray-500 hidden md:block">
                        <span>{diaSemana} de {mesActual}</span>
                    </p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <MonthNavigator
                        currentMonth={currentDate.getMonth()}
                        currentYear={currentDate.getFullYear()}
                        onMonthChange={handleMonthChange}
                    />
                    <div className="relative">
                        <button
                            onClick={() => setMostrarOpciones(prev => !prev)}
                            className="p-1 rounded-lg bg-button my-4"
                        >
                            <MdMoreVert size={24} />
                        </button>
                        {mostrarOpciones && (
                            <div className="absolute right-0 mt-2 bg-button rounded-lg border border-gray-200 shadow z-10">
                                <Link
                                    to="/resumen"
                                    className="flex items-center gap-2 px-6 py-3 text-sm hover:bg-gray-100 transition"
                                >
                                    <MdInsertChartOutlined size={20} />
                                    Anual
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loader o estadísticas */}
            {loading ? (
                <div className="flex items-center justify-between pb-4 border-b-0 md:border-b border-gray-200 bg-base-white p-6">
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-40 h-10 bg-base-white rounded-xl"></div>
                        <div className="w-10 h-10 bg-base-white rounded-lg"></div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 bg-base-white p-4 rounded-b-3xl">
                    {/* Sección de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Gastos de envío */}
                        <div className="border rounded-xl p-6 md:border-r md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-r-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Gastos de envío</p>
                                    <p className="text-2xl font-medium">{formatCurrency(totalEnvios)}</p>
                                </div>
                                <div className="py-2">
                                    <IndicadorPorcentaje valor={variacionEnvios} />
                                </div>
                            </div>
                        </div>

                        {/* Ventas totales */}
                        <div className="border rounded-xl p-6 md:border-r md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-r-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ventas totales</p>
                                    <p className="text-2xl font-medium">{formatCurrency(totalVentas)}</p>
                                </div>
                                <div className="py-2">
                                    <IndicadorPorcentaje valor={variacionVentas} />
                                </div>
                            </div>
                        </div>

                        {/* Registros */}
                        <div className="border rounded-xl p-6 md:border-t-0 md:border-b-0 md:border-l-0 md:border-r-0 md:rounded-r-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Registros</p>
                                    <p className="text-2xl font-medium">{totalRegistros.toLocaleString()}</p>
                                </div>
                                <div className="py-2">
                                    <IndicadorPorcentaje valor={variacionRegistros} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Segunda sección con Top Distritos y Calendario */}
            {loading ? (
                <div>
                    <div className="space-y-6 bg-base-white p-4 rounded-b-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border rounded-xl p-6 space-y-3">
                                    <div className="h-4 w-24 bg-base-white rounded-xl"></div>
                                    <div className="h-6 w-28 bg-base-white rounded-xl"></div>
                                    <div className="h-5 w-10 bg-base-white rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-6 bg-base p-1 rounded-3xl">
                        <div className="grid grid-cols-1 lg:grid-cols-[29%_70%] gap-4">
                            <div className="p-6 bg-base-white rounded-3xl space-y-4">
                                <div className="h-6 w-40 bg-base-white rounded-xl"></div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b">
                                        <div className="h-4 w-32 bg-base-white rounded-xl"></div>
                                        <div className="h-6 w-14 bg-base-white rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden lg:block bg-base-white rounded-3xl">
                                <div className="h-[400px] p-4 bg-base-white rounded-3xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-2 grid grid-cols-1 gap-6 bg-base p-1 rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[29%_70%] gap-4">
                        {/* Top Distritos */}
                        <div className="p-6 bg-base-white rounded-3xl">
                            <h2 className="text-xl font-medium mb-4">Top Distritos</h2>
                            <div className="space-y-3">
                                {mostFrequentDistrict.map(([district, count]) => (
                                    <div key={district} className="flex justify-between items-center p-3 border-b">
                                        <span className="font-medium capitalize flex-1 truncate max-w-[70%]">
                                            {district}
                                        </span>
                                        <span className="bg-button text-dark px-3 py-1 rounded-full text-sm shrink-0">
                                            {count} envío{count !== 1 && 's'}
                                        </span>
                                    </div>
                                ))}
                                {mostFrequentDistrict.length === 0 && !loading && (
                                    <p className="text-center text-gray-500">Aún no hay datos</p>
                                )}
                            </div>
                        </div>

                        {/* Calendario solo visible en desktop aquí */}
                        <div className="hidden lg:block bg-base-white rounded-3xl">
                            <div className="h-full p-4">
                                <Calendario />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Graficos;
