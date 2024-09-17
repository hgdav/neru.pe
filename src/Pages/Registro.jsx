import React, { useState, useEffect, useCallback } from 'react';
import MonthNavigator from '../Components/RegistroClientes/MonthNavigator';
import ClientCard from '../Components/RegistroClientes/ClientCard';
import FloatingButton from '../Components/RegistroClientes/FloatingButton';
import SearchBar from '../Components/RegistroClientes/SearchBar';
import FilterByStatus from '../Components/RegistroClientes/FilterByStatus';
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
import { format, isToday } from 'date-fns';

const Registro = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [groupedRecords, setGroupedRecords] = useState({});
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
            where('fecha', '>=', startOfMonth),
            where('fecha', '<=', endOfMonth),
            orderBy('fecha', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedRecords = [];
            querySnapshot.forEach((doc) => {
                fetchedRecords.push({ id: doc.id, ...doc.data() });
            });
            setRecords(fetchedRecords);
            setFilteredRecords(fetchedRecords);

            if (querySnapshot.docs.length > 0) {
                const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                setLastVisible(lastDoc);
            } else {
                setLastVisible(null);
            }

            setIsLoading(false);
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
        let currentRecords = records;
        if (isFilteredByStatus) {
            currentRecords = records.filter((record) => record.estado_empaque !== 'Enviado');
        }

        if (searchTerm === '') {
            setFilteredRecords(currentRecords);
        } else {
            const filtered = currentRecords.filter((record) => {
                const nombre = record.nombre ? record.nombre.toLowerCase() : '';
                const ticket = record.ticket ? record.ticket.toString().toLowerCase() : '';
                const telefono = record.telefono ? record.telefono.toLowerCase() : '';

                return (
                    nombre.includes(searchTerm.toLowerCase()) ||
                    ticket.includes(searchTerm.toLowerCase()) ||
                    telefono.includes(searchTerm.toLowerCase())
                );
            });
            setFilteredRecords(filtered);
        }
    }, [searchTerm, records, isFilteredByStatus]);

    useEffect(() => {
        if (isFilteredByStatus) {
            // Agrupa los registros filtrados por fecha de envío o fecha de registro
            const grouped = filteredRecords.reduce((groups, record) => {
                const fechaEnvio = record.fecha_envio ? record.fecha_envio.toDate() : null;
                const fechaRegistro = record.fecha ? record.fecha.toDate() : null;
                const dateToUse = fechaEnvio || fechaRegistro;

                if (dateToUse) {
                    const dateKey = isToday(dateToUse) ? 'Hoy' : format(dateToUse, 'dd/MM/yyyy');
                    if (!groups[dateKey]) {
                        groups[dateKey] = [];
                    }
                    groups[dateKey].push(record);
                } else {
                    if (!groups['Sin fecha']) {
                        groups['Sin fecha'] = [];
                    }
                    groups['Sin fecha'].push(record);
                }
                return groups;
            }, {});
            setGroupedRecords(grouped);
        } else {
            setGroupedRecords({}); // Limpia los registros agrupados cuando no hay filtro
        }
    }, [filteredRecords, isFilteredByStatus]);

    const loadMoreRecords = () => {
        if (isLoading || !lastVisible) return;

        setIsLoading(true);

        let q;

        if (isFilteredByStatus) {
            // Puedes decidir si manejar o no la paginación cuando el filtro está activo
            setIsLoading(false);
            return;
        } else {
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

            q = query(
                collection(db, 'registro-clientes'),
                where('fecha', '>=', startOfMonth),
                where('fecha', '<=', endOfMonth),
                orderBy('fecha', 'desc'),
                startAfter(lastVisible),
                limit(10)
            );
        }

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

        if (!isFilteredByStatus) {
            // Aplicando el filtro
            setIsLoading(true);

            const q = query(
                collection(db, 'registro-clientes'),
                where('estado_empaque', '!=', 'Enviado'),
                orderBy('estado_empaque')
            );

            getDocs(q)
                .then((querySnapshot) => {
                    const fetchedRecords = [];
                    querySnapshot.forEach((doc) => {
                        fetchedRecords.push({ id: doc.id, ...doc.data() });
                    });

                    // Ordenamos los registros manualmente por fecha de envío o fecha
                    fetchedRecords.sort((a, b) => {
                        const fechaA = a.fecha_envio ? a.fecha_envio.toDate() : a.fecha ? a.fecha.toDate() : null;
                        const fechaB = b.fecha_envio ? b.fecha_envio.toDate() : b.fecha ? b.fecha.toDate() : null;

                        if (fechaA && fechaB) {
                            return fechaA - fechaB;
                        } else if (fechaA) {
                            return -1;
                        } else if (fechaB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    setRecords(fetchedRecords);
                    setFilteredRecords(fetchedRecords);
                    setIsLoading(false);

                    setLastVisible(null);
                })
                .catch((error) => {
                    console.error('Error fetching filtered records:', error);
                    setIsLoading(false);
                });
        } else {
            // Quitando el filtro, volvemos a los registros iniciales
            fetchInitialRecords();
        }
    };

    return (
        <div className="registro-container p-4">
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

            <div id="recordsContainer" className="w-full">
                <div className="container mx-auto">
                    {isFilteredByStatus ? (
                        isLoading ? (
                            <div className="text-center mt-6">
                                <p>Cargando registros...</p>
                            </div>
                        ) : Object.keys(groupedRecords).length > 0 ? (
                            Object.keys(groupedRecords).map((dateKey) => (
                                <div key={dateKey} className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">{dateKey}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedRecords[dateKey].map((record) => (
                                            <ClientCard key={record.id} client={record} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No hay registros para el término de búsqueda ingresado o estado seleccionado.
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
                                    <p className="text-center text-gray-500">
                                        No hay registros para el término de búsqueda ingresado o estado seleccionado.
                                    </p>
                                )}
                            </div>
                            {lastVisible && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={loadMoreRecords}
                                        disabled={isLoading}
                                        className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary transition duration-300"
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
