import React, { useState, useEffect, useCallback } from 'react';
import MonthNavigator from '../Components/RegistroClientes/MonthNavigator';
import ClientCard from '../Components/RegistroClientes/ClientCard';
import SearchBar from '../Components/RegistroClientes/SearchBar';
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
    addDoc
} from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { format, isToday, compareAsc } from 'date-fns';
import { es } from 'date-fns/locale';
import AddRecordModal from '../Components/RegistroClientes/AddRecordModal';

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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [pendingTodayCount, setPendingTodayCount] = useState(0);
    const [selectedCourier, setSelectedCourier] = useState('Todos');
    const [couriers, setCouriers] = useState([]);

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

            const uniqueCouriers = [...new Set(fetchedRecords.map(record => record.tipo_envio).filter(Boolean))];
            setCouriers(['Todos', ...uniqueCouriers]);

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

    const calculatePendingToday = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pending = records.filter(record => {
            const recordDate = record.fecha_envio?.toDate();
            return recordDate &&
                record.estado_empaque !== 'Enviado';
        });

        setPendingTodayCount(pending.length);
    }, [records]);

    useEffect(() => {
        calculatePendingToday();
    }, [records, calculatePendingToday]);

    useEffect(() => {
        if (searchTerm === '' && !isFilteredByStatus) {
            const sortedRecords = [...records].sort((a, b) => {
                if (b.fecha_envio && a.fecha_envio) {
                    return b.fecha_envio.toMillis() - a.fecha_envio.toMillis();
                }
                return b.ticket - a.ticket;
            });
            setFilteredRecords(sortedRecords);
            const uniqueCouriers = [...new Set(records.map(record => record.tipo_envio).filter(Boolean))];
            setCouriers(['Todos', ...uniqueCouriers]);

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
                    if (isFilteredByStatus) {
                        const uniqueCouriers = [...new Set(currentRecords.map(record => record.tipo_envio).filter(Boolean))];
                        setCouriers(['Todos', ...uniqueCouriers]);
                    }

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

                    if (isFilteredByStatus && selectedCourier !== 'Todos') {
                        currentRecords = currentRecords.filter(record =>
                            record.tipo_envio === selectedCourier
                        );
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
    }, [searchTerm, isFilteredByStatus, records, selectedCourier]);

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
        setSelectedCourier('Todos');
    };

    const handleAddRecord = async (newRecordData) => {
        try {
            await addDoc(collection(db, 'registro-clientes'), {
                ...newRecordData,
                fecha_envio: Timestamp.fromDate(new Date(newRecordData.fecha_envio)),
                estado_tracking: 'Pendiente',
                cod_tracking: '',
                nro_seguimiento: '',
                clave_recojo: '',
            });
            setIsAddModalOpen(false);
            fetchInitialRecords();
        } catch (error) {
            console.error('Error al agregar registro:', error);
        }
    };

    const handleFilterClick = () => {
        setIsFilteredByStatus(!isFilteredByStatus);
        setSelectedCourier('Todos');
    };

    return (
        <div className="registro-container p-4 bg-base mb-10">
            <AddRecordModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddRecord}
            />

            <div className="container mx-auto px-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch mb-2">

                    <div className="flex flex-1 flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 overflow-x-auto">
                        <div className="min-w-[120px] max-w-[500px] sm:max-w-[500px] flex-1">
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </div>

                        <div className="flex flex-row justify-end items-center gap-2 sm:gap-4 flex-shrink-0">
                            <MonthNavigator
                                currentMonth={currentDate.getMonth()}
                                currentYear={currentDate.getFullYear()}
                                onMonthChange={handleMonthChange}
                            />
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="py-2 px-3 sm:px-4 sm:py-3 rounded-xl text-sm bg-primary-button text-white whitespace-nowrap"
                            >
                                <span className="sm:hidden">Nuevo</span>
                                <span className="hidden sm:block">Nuevo Registro</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center mt-2 gap-4 sm:gap-4 flex-shrink-0">
                    <div className="flex gap-4 sm:gap-4">
                        <span
                            className={`text-md cursor-pointer border-b-2 border-solid ${!isFilteredByStatus ? 'text-accent-secondary border-accent-secondary' : 'text-gray-500 border-transparent'}`}
                            onClick={() => setIsFilteredByStatus(false)}
                        >
                            Todos
                        </span>
                        <span
                            className={`text-md cursor-pointer border-b-2 border-solid ${isFilteredByStatus ? 'text-accent-secondary border-accent-secondary' : 'text-gray-500 border-transparent'}`}
                            onClick={handleFilterClick}
                        >
                            Para Hoy ({pendingTodayCount})
                        </span>
                    </div>

                    {isFilteredByStatus && (
                        <div className="flex items-center">
                            <select
                                id="courier-filter"
                                value={selectedCourier}
                                onChange={(e) => setSelectedCourier(e.target.value)}
                                className="p-1 rounded-lg bg-button border border-black my-4">
                                {couriers.map(courier => (
                                    <option key={courier} value={courier}>
                                        {courier}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div id="recordsContainer" className="w-full bg-base pt-4 mt-2 px-2">
                <div className="container mx-auto">
                    {isLoading ? (
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
                                <div key={dateKey} className="mb-[3rem]">
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
                                    <p className="text-center text-gray-500">
                                        {searchTerm === '' ? 'No hay registros disponibles :c.' : 'No se encontraron coincidencias :c.'}
                                    </p>
                                )}
                            </div>
                            {lastVisible && !isFilteredByStatus && searchTerm === '' && (
                                <div className="text-center mt-6 mb-7">
                                    <button
                                        onClick={loadMoreRecords}
                                        disabled={isLoading}
                                        className="mb-6 py-3 px-3 sm:px-4 rounded-xl text-sm bg-primary-button text-white whitespace-nowrap"
                                    >
                                        {isLoading ? 'Cargando...' : 'Cargar más'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Registro };