import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../utils/firebaseConfig';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    orderBy
} from 'firebase/firestore';
import moment from 'moment';

const teamMembers = [
    { id: 1, name: 'Usuario 1', code: '1234' },
    { id: 2, name: 'Usuario 2', code: '5678' },
    { id: 3, name: 'Usuario 3', code: '9012' },
    { id: 4, name: 'Usuario 4', code: '3456' }
];

// Función auxiliar para formatear fechas, considerando que pueden venir como Firestore Timestamp o Date
const formatTime = (date, format = 'hh:mm A') => {
    if (!date) return '';
    const d = date && date.toDate ? date.toDate() : date;
    return moment(d).format(format);
};

const Hora = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [personalCode, setPersonalCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [existingCheckIn, setExistingCheckIn] = useState(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // Estados para visibilidad y filtrado de registros
    const [showAttendanceRecords, setShowAttendanceRecords] = useState(false);
    const [filterUser, setFilterUser] = useState('');
    const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD'));

    // Detección responsiva sin react-device-detect
    useEffect(() => {
        const handleResize = () => {
            setIsMobileDevice(window.innerWidth < 640); // breakpoint 'sm' de Tailwind
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Función para procesar la salida (check-out)
    const handleCheckOut = useCallback(
        async (auto = false) => {
            if (!existingCheckIn) {
                setError('No has registrado entrada');
                return;
            }
            setLoading(true);
            try {
                await updateDoc(doc(db, 'attendance', existingCheckIn.id), {
                    checkOut: moment().toDate(),
                    autoCheckOut: auto
                });
                setExistingCheckIn(null);
                setError('');
            } catch (err) {
                setError('Error al registrar salida');
            }
            setLoading(false);
        },
        [existingCheckIn]
    );

    // Auto check-out a las 8:00 PM
    useEffect(() => {
        const checkAutoLogout = () => {
            const currentHour = moment().hour();
            if (currentHour >= 20 && existingCheckIn && !existingCheckIn.checkOut) {
                handleCheckOut(true);
            }
        };
        const interval = setInterval(checkAutoLogout, 60000);
        return () => clearInterval(interval);
    }, [existingCheckIn, handleCheckOut]);

    // Consultar registro de entrada del día actual para el usuario
    const fetchTodayCheckIn = async (userId) => {
        const q = query(
            collection(db, 'attendance'),
            where('userId', '==', userId),
            where('date', '==', moment().format('YYYY-MM-DD'))
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            setExistingCheckIn({ id: docSnap.id, ...docSnap.data() });
        } else {
            setExistingCheckIn(null);
        }
    };

    const handleUserSelection = async (user) => {
        setSelectedUser(user);
        setError('');
        await fetchTodayCheckIn(user.id);
    };

    const validateCode = () => selectedUser && selectedUser.code === personalCode;

    const handleCheckIn = async () => {
        // Evitar ingreso duplicado
        if (existingCheckIn) {
            setError(`Ya estás activo desde ${formatTime(existingCheckIn.checkIn, 'hh:mm A')}`);
            return;
        }
        if (!validateCode()) {
            setError('Código incorrecto');
            return;
        }
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'attendance'), {
                userId: selectedUser.id,
                checkIn: moment().toDate(),
                checkOut: null,
                date: moment().format('YYYY-MM-DD'),
                autoCheckOut: false
            });
            // Se guarda como Date; en caso de recargar, se obtendrá desde Firestore (Timestamp)
            setExistingCheckIn({ id: docRef.id, checkIn: new Date() });
            setError('');
        } catch (err) {
            setError('Error al registrar entrada');
        }
        setLoading(false);
    };

    // Función para obtener registros de asistencia con filtros, envuelta en useCallback para estabilidad
    const fetchAttendanceRecords = useCallback(async () => {
        try {
            const attendanceRef = collection(db, 'attendance');
            const constraints = [];
            if (filterUser) {
                constraints.push(where('userId', '==', parseInt(filterUser)));
            }
            if (filterDate) {
                constraints.push(where('date', '==', filterDate));
            }
            constraints.push(orderBy('checkIn', 'desc'));
            const qRef = query(attendanceRef, ...constraints);
            const querySnapshot = await getDocs(qRef);
            const records = querySnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setAttendanceRecords(records);
        } catch (err) {
            console.error('Error fetching attendance records:', err);
        }
    }, [filterUser, filterDate]);

    // Cargar registros al mostrar la sección de asistencia
    useEffect(() => {
        if (showAttendanceRecords) {
            fetchAttendanceRecords();
        }
    }, [showAttendanceRecords, fetchAttendanceRecords]);

    // Renderizado para vista web
    const renderWebView = () => (
        <div className="max-w-md mx-auto p-4 bg-gray-100 rounded shadow">
            {!selectedUser ? (
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Selecciona tu usuario</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {teamMembers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSelection(user)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                            >
                                {user.name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : existingCheckIn ? (
                <div className="mb-4">
                    <h3 className="text-lg mb-2">
                        Registro de entrada: {formatTime(existingCheckIn.checkIn, 'HH:mm')}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                        Ya estás activo desde {formatTime(existingCheckIn.checkIn, 'hh:mm A')}
                    </p>
                    <button
                        onClick={() => handleCheckOut()}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                        {loading ? 'Procesando...' : 'Registrar Salida'}
                    </button>
                </div>
            ) : (
                <div className="mb-4">
                    <h3 className="text-lg mb-2">Verificación de identidad: {selectedUser.name}</h3>
                    <input
                        type="password"
                        value={personalCode}
                        onChange={(e) => setPersonalCode(e.target.value)}
                        placeholder="Ingresa tu código personal"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <button
                        onClick={handleCheckIn}
                        disabled={loading || personalCode.length !== 4}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
                    >
                        {loading ? 'Registrando...' : 'Registrar Entrada'}
                    </button>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );

    // Renderizado para vista móvil
    const renderMobileView = () => (
        <div className="p-4 bg-gray-100 rounded shadow">
            {!selectedUser ? (
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Selecciona tu perfil</h2>
                    <select
                        onChange={(e) =>
                            handleUserSelection(
                                teamMembers.find((u) => u.id === parseInt(e.target.value))
                            )
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Seleccionar usuario</option>
                        {teamMembers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="mb-4">
                    <h3 className="text-lg mb-2">Bienvenido: {selectedUser.name}</h3>
                    {existingCheckIn ? (
                        <>
                            <p className="text-sm text-gray-500 mb-2">
                                Ya estás activo desde {formatTime(existingCheckIn.checkIn, 'hh:mm A')}
                            </p>
                            <button
                                onClick={() => handleCheckOut()}
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
                            >
                                {loading ? 'Procesando...' : 'Registrar Salida'}
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 mb-2">No has registrado entrada.</p>
                    )}
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {isMobileDevice ? renderMobileView() : renderWebView()}

            {/* Botón para mostrar/ocultar registros de asistencia */}
            <div className="max-w-md mx-auto mt-6">
                <button
                    onClick={() => setShowAttendanceRecords(!showAttendanceRecords)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded w-full"
                >
                    {showAttendanceRecords ? 'Ocultar registros de asistencia' : 'Mostrar registros de asistencia'}
                </button>
            </div>

            {showAttendanceRecords && (
                <div className="mt-6 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-4">Registro de Asistencia</h2>
                    {/* Filtros */}
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <div className="mb-2 sm:mb-0">
                            <label className="block text-sm font-medium text-gray-700">Usuario</label>
                            <select
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            >
                                <option value="">Todos</option>
                                {teamMembers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2 sm:mb-0">
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={fetchAttendanceRecords}
                                className="mt-6 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 border px-4">Usuario</th>
                                    <th className="py-2 border px-4">Fecha</th>
                                    <th className="py-2 border px-4">Hora de Entrada</th>
                                    <th className="py-2 border px-4">Hora de Salida</th>
                                    <th className="py-2 border px-4">Auto Salida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td className="border px-4 py-2">
                                            {teamMembers.find((user) => user.id === record.userId)?.name || 'Desconocido'}
                                        </td>
                                        <td className="border px-4 py-2">{record.date}</td>
                                        <td className="border px-4 py-2">
                                            {record.checkIn
                                                ? formatTime(record.checkIn, 'HH:mm')
                                                : '-'}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {record.checkOut
                                                ? formatTime(record.checkOut, 'HH:mm')
                                                : '-'}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {record.autoCheckOut ? 'Sí' : 'No'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-4 text-center text-gray-600">
                <p>La salida automática se registrará a las 8:00 PM</p>
            </div>
        </div>
    );
};

export { Hora };
