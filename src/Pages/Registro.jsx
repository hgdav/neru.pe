import React, { useState, useEffect } from 'react';
import MonthNavigator from '../Components/RegistroClientes/MonthNavigator';
import ClientCard from '../Components/RegistroClientes/ClientCard';
import FloatingButton from '../Components/RegistroClientes/FloatingButton';
import SearchBar from '../Components/RegistroClientes/SearchBar';
import FilterByStatus from '../Components/RegistroClientes/FilterByStatus';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const Registro = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [lastVisible, setLastVisible] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilteredByStatus, setIsFilteredByStatus] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfMonth = Timestamp.fromDate(startDate);
        const endOfMonth = Timestamp.fromDate(endDate);

        const q = query(
            collection(db, 'registro-clientes'),
            where('fecha', '>=', startOfMonth),
            where('fecha', '<=', endOfMonth),
            orderBy('ticket', 'desc'), // Ordenar por ticket en lugar de fecha - orderBy('fecha', 'desc'),
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
        // Filtra los registros cada vez que el término de búsqueda cambia
        if (searchTerm === '') {
            setFilteredRecords(records); // Si no hay búsqueda, mostramos todos los registros
        } else {
            const filtered = records.filter((record) => {
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
    }, [searchTerm, records]);

    const loadMoreRecords = () => {
        if (isLoading || !lastVisible) return;

        setIsLoading(true);

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfMonth = Timestamp.fromDate(startDate);
        const endOfMonth = Timestamp.fromDate(endDate);

        const q = query(
            collection(db, 'registro-clientes'),
            where('fecha', '>=', startOfMonth),
            where('fecha', '<=', endOfMonth),
            orderBy('ticket', 'desc'),// orderBy('fecha', 'desc'),
            startAfter(lastVisible),
            limit(10)
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

    // Función para manejar el filtrado por estado de empaque
    const handleFilterByStatus = () => {
        setIsFilteredByStatus(!isFilteredByStatus); // Alternar entre mostrar todos o solo los no enviados
        if (isFilteredByStatus) {
            setFilteredRecords(records); // Mostrar todos los registros si se quita el filtro
        } else {
            const filtered = records.filter((record) => record.estado_empaque !== 'Enviado');
            setFilteredRecords(filtered);
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
                <div className='flex flex-row justify-between items-center mb-4 gap-4'>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <FilterByStatus handleFilter={handleFilterByStatus} />
                </div>

            </div>


            <div id="recordsContainer" className="w-full">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record) => (
                                <ClientCard key={record.id} client={record} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No hay registros para el término de búsqueda ingresado o estado seleccionado.</p>
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
                </div>
            </div>
        </div>
    );
};

export { Registro };
