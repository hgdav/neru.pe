import React, { useState, useEffect, useCallback } from 'react';
import MonthNavigator from '../Components/RegistroClientes/MonthNavigator';
import ClientCard from '../Components/RegistroClientes/ClientCard';
import FloatingButton from '../Components/RegistroClientes/FloatingButton';
import SearchBar from '../Components/RegistroClientes/SearchBar';
import FilterByStatus from '../Components/RegistroClientes/FilterByStatus';
import { LoadingRecords } from '../Components/RegistroClientes/LoadingRecords';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    getDocs,
    startAfter,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { format, isToday, compareAsc } from 'date-fns';
import { es } from 'date-fns/locale';

const Registro = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [groupedRecords, setGroupedRecords] = useState({});
    const [orderedDates, setOrderedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [lastVisible, setLastVisible] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilteredByStatus, setIsFilteredByStatus] = useState(false);

    const fetchInitialRecords = useCallback(() => {
        setIsLoading(true);

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );

        const startOfMonth = Timestamp.fromDate(startDate);
        const endOfMonth = Timestamp.fromDate(endDate);

        const q = query(
            collection(db, 'registro-clientes'),
            where('fecha_envio', '>=', startOfMonth),
            where('fecha_envio', '<=', endOfMonth),
            orderBy('ticket', 'desc'),
            orderBy('fecha_envio', 'desc'),
            limit(15)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedRecords = [];
            querySnapshot.forEach((doc) => {
                fetchedRecords.push({ id: doc.id, ...doc.data() });
            });

            setRecords(fetchedRecords);
            setFilteredRecords(fetchedRecords);
            setIsLoading(false);

            if (querySnapshot.docs.length > 0) {
                const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                setLastVisible(lastDoc);
            } else {
                setLastVisible(null);
            }
        });

        return () => {
            unsubscribe();
            setRecords([]);
            setLastVisible(null);
        };
    }, [currentDate]);

    useEffect(() => {
        fetchInitialRecords();
    }, [currentDate, fetchInitialRecords]);

    useEffect(() => {
        if (searchTerm === '' && !isFilteredByStatus) {
            const sortedRecords = [...records].sort((a, b) => {
                if (b.fecha_envio && a.fecha_envio) {
                    return b.fecha_envio.toMillis() - a.fecha_envio.toMillis();
                }
                return b.ticket - a.ticket;  // Orden alternativo si no hay fecha_envio
            });
            setFilteredRecords(sortedRecords);
        } else {
            setIsLoading(true);

            let q = collection(db, 'registro-clientes');

            if (isFilteredByStatus) {
                q = query(q, where('estado_empaque', '!=', 'Enviado'));
            }

            getDocs(q)
                .then((querySnapshot) => {
                    const fetchedRecords = [];
                    querySnapshot.forEach((doc) => {
                        fetchedRecords.push({ id: doc.id, ...doc.data() });
                    });

                    let currentRecords = fetchedRecords;

                    // Filtrar por término de búsqueda
                    if (searchTerm !== '') {
                        currentRecords = currentRecords.filter((record) => {
                            const nombre = record.nombre ? record.nombre.toLowerCase() : '';
                            const ticket = record.ticket ? record.ticket.toString().toLowerCase() : '';
                            const telefono = record.telefono ? record.telefono.toLowerCase() : '';

                            return (
                                nombre.includes(searchTerm.toLowerCase()) ||
                                ticket.includes(searchTerm.toLowerCase()) ||
                                telefono.includes(searchTerm.toLowerCase())
                            );
                        });
                    }

                    const sortedRecords = currentRecords.sort((a, b) => {
                        if (b.fecha_envio && a.fecha_envio) {
                            return b.fecha_envio.toMillis() - a.fecha_envio.toMillis();
                        }
                        return b.ticket - a.ticket;
                    });

                    setFilteredRecords(sortedRecords);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching records:', error);
                    setIsLoading(false);
                });
        }
    }, [searchTerm, isFilteredByStatus, records]);


    // Agrupación por fechas y estado
    useEffect(() => {
        if (isFilteredByStatus) {
            const grouped = filteredRecords.reduce((groups, record) => {
                const fechaEnvioTimestamp = record.fecha_envio || null;

                if (fechaEnvioTimestamp) {
                    let dateObj;

                    if (fechaEnvioTimestamp instanceof Timestamp) {
                        dateObj = fechaEnvioTimestamp.toDate();
                    } else if (fechaEnvioTimestamp instanceof Date) {
                        dateObj = fechaEnvioTimestamp;
                    } else if (typeof fechaEnvioTimestamp === 'string') {
                        const [year, month, day] = fechaEnvioTimestamp.split('-').map(Number);
                        dateObj = new Date(year, month - 1, day);
                    } else {
                        console.warn(`Tipo desconocido para fecha_envio: ${typeof fechaEnvioTimestamp}`);
                        dateObj = null;
                    }

                    if (dateObj) {
                        const dateKey = isToday(dateObj)
                            ? 'Hoy'
                            : format(dateObj, 'EEEE, d MMM', { locale: es });

                        if (!groups[dateKey]) {
                            groups[dateKey] = { records: [], date: dateObj };
                        }
                        groups[dateKey].records.push(record);
                    } else {
                        if (!groups['Sin fecha de envío']) {
                            groups['Sin fecha de envío'] = { records: [], date: null };
                        }
                        groups['Sin fecha de envío'].records.push(record);
                    }
                } else {
                    if (!groups['Sin fecha de envío']) {
                        groups['Sin fecha de envío'] = { records: [], date: null };
                    }
                    groups['Sin fecha de envío'].records.push(record);
                }
                return groups;
            }, {});

            Object.keys(grouped).forEach((dateKey) => {
                grouped[dateKey].records.sort((a, b) => b.ticket - a.ticket);
            });

            const dates = Object.keys(grouped).map((key) => ({
                key,
                date: grouped[key].date,
            }));

            dates.sort((a, b) => {
                if (a.key === 'Hoy') return -1;
                if (b.key === 'Hoy') return 1;
                if (!a.date) return 1;
                if (!b.date) return -1;
                return compareAsc(a.date, b.date);
            });

            setOrderedDates(dates.map((item) => item.key));
            setGroupedRecords(grouped);
        } else {
            setGroupedRecords({});
            setOrderedDates([]);
        }
    }, [filteredRecords, isFilteredByStatus]);

    const loadMoreRecords = () => {
        if (isLoading || !lastVisible || isFilteredByStatus || searchTerm !== '') return;

        setIsLoading(true);

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );

        const startOfMonth = Timestamp.fromDate(startDate);
        const endOfMonth = Timestamp.fromDate(endDate);

        const q = query(
            collection(db, 'registro-clientes'),
            where('fecha_envio', '>=', startOfMonth),
            where('fecha_envio', '<=', endOfMonth),
            orderBy('ticket', 'desc'),
            orderBy('fecha_envio', 'desc'),
            startAfter(lastVisible),
            limit(20)
        );

        getDocs(q)
            .then((querySnapshot) => {
                const fetchedRecords = [];
                querySnapshot.forEach((doc) => {
                    fetchedRecords.push({ id: doc.id, ...doc.data() });
                });

                if (querySnapshot.docs.length > 0) {
                    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                    setLastVisible(lastDoc);
                } else {
                    setLastVisible(null);
                }

                setRecords((prevRecords) => [...prevRecords, ...fetchedRecords]);
                setFilteredRecords((prevFiltered) => [...prevFiltered, ...fetchedRecords]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error cargando más registros:', error);
                setIsLoading(false);
            });
    };

    const handleMonthChange = (newDate) => {
        setCurrentDate(newDate);
    };

    const handleFilterByStatus = () => {
        setIsFilteredByStatus(!isFilteredByStatus);
    };


    return (
        <div className="registro-container p-4 bg-bg-base">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
                    <MonthNavigator
                        currentMonth={currentDate.getMonth()}
                        currentYear={currentDate.getFullYear()}
                        onMonthChange={handleMonthChange}
                    />
                    <div className="flex flex-row justify-between items-center mb-4 gap-4">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <FilterByStatus handleFilter={handleFilterByStatus} />
                    </div>
                </div>
            </div>

            <div id="recordsContainer" className="w-full bg-bg-base">
                <div className="container mx-auto">
                    {isLoading ? (
                        // Mostrar el efecto de carga mientras se realiza la búsqueda o carga de registros
                        <div className="text-center mt-6">
                            <div className="mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <LoadingRecords />
                                    <LoadingRecords />
                                    <LoadingRecords />
                                    <LoadingRecords />
                                    <LoadingRecords />
                                    <LoadingRecords />
                                </div>
                            </div>
                        </div>
                    ) : isFilteredByStatus ? (
                        orderedDates.length > 0 ? (
                            orderedDates.map((dateKey) => (
                                <div key={dateKey} className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">{dateKey}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedRecords[dateKey].records.map((record) => (
                                            <ClientCard key={record.id} client={record} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No hay registros para el día de hoy :c.
                            </p>
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <ClientCard key={record.id} client={record} />
                                    ))
                                ) : (
                                    // Mostrar mensaje cuando no hay registros disponibles o coincidencias
                                    <p className="text-center text-gray-500">
                                        {searchTerm === '' ? 'No hay registros disponibles :c.' : 'No se encontraron coincidencias :c.'}
                                    </p>
                                )}
                            </div>
                            {lastVisible && !isFilteredByStatus && searchTerm === '' && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={loadMoreRecords}
                                        disabled={isLoading}
                                        className="bg-accent-secondary text-accent-secondary-dark px-4 py-2 rounded-md"
                                    >
                                        {isLoading ? 'Cargando...' : 'Cargar más'}
                                    </button>
                                </div>
                            )}
                            <FloatingButton />
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export { Registro };
