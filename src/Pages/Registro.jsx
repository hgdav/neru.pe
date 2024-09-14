import React, { useState, useEffect } from 'react';
import MonthNavigator from '../Components/MonthNavigator.jsx';
import ClientCard from '../Components/ClientCard.jsx';
import FloatingButton from '../Components/FloatingButton.jsx';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const Registro = () => {
    const [records, setRecords] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [lastVisible, setLastVisible] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            orderBy('fecha', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedRecords = [];
            querySnapshot.forEach((doc) => {
                fetchedRecords.push({ id: doc.id, ...doc.data() });
            });
            setRecords(fetchedRecords);

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
            orderBy('fecha', 'desc'),
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

    return (
        <div className="registro-container p-4">
            <MonthNavigator
                currentMonth={currentDate.getMonth()}
                currentYear={currentDate.getFullYear()}
                onMonthChange={handleMonthChange}
            />
            <div id="recordsContainer" className="w-full">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.length > 0 ? (
                            records.map((record) => (
                                <ClientCard key={record.id} client={record} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No hay registros para el mes seleccionado.</p>
                        )}
                    </div>
                    {lastVisible && (
                        <div className="text-center mt-6">
                            <button
                                onClick={loadMoreRecords}
                                disabled={isLoading}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
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
