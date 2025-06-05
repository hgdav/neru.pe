import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { addDoc, collection, Timestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import toast from 'react-hot-toast';

const AddRecordModal = ({ isOpen, onClose }) => {
    const [ticket, setTicket] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [distrito, setDistrito] = useState('');
    const [costoPedido, setCostoPedido] = useState(0);
    const [dedicatoria, setDedicatoria] = useState(false);
    const [empaqueRegalo, setEmpaqueRegalo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Variables adicionales
    const codTracking = '';
    const nroSeguimiento = '';
    const claveRecojo = '';
    const estadoTracking = 'Pendiente';

    const getTomorrow = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);  // Sumar un día
        return mañana.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    };

    const [fechaEnvio, setFechaEnvio] = useState(getTomorrow());

    const opcionesTipoEnvio = [
        'Olva Courier',
        'Shalom',
        'InDrive',
        'GoPack',
        'OTS',
        'Presencial',
    ];

    const [tipoEnvio, setTipoEnvio] = useState('Olva Courier');

    const opcionesEstadoEmpaque = [
        'Pendiente',
        'Empacado Listo',
        'Documentado',
        'Enviado',
    ];

    const [estadoEmpaque, setEstadoEmpaque] = useState('Pendiente');

    useEffect(() => {
        if (isOpen) {
            // Resetear los campos necesarios
            setNombre('');
            setTelefono('');
            setDistrito('');
            setCostoPedido('');
            setDedicatoria(false);
            setEmpaqueRegalo(false);
            setIsSubmitting(false);
            setFechaEnvio(getTomorrow());

            // Obtener el último ticket
            const fetchLastTicket = async () => {
                try {
                    const q = query(
                        collection(db, 'registro-clientes'),
                        orderBy('ticket', 'desc'),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const lastTicketDoc = querySnapshot.docs[0];
                        const lastTicketData = lastTicketDoc.data();
                        const lastTicketNumber = parseInt(lastTicketData.ticket, 10);
                        setTicket((lastTicketNumber + 1).toString());
                    } else {
                        setTicket('1');
                    }
                } catch (error) {
                    console.error('Error obteniendo el último ticket:', error);
                }
            };

            fetchLastTicket();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const q = query(
                collection(db, 'registro-clientes'),
                where('ticket', '==', ticket)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error('El número de pedido ya existe.');
                setIsSubmitting(false);
                return;
            }
        } catch (error) {
            toast.error('Error verificando el ticket:', error);
            setIsSubmitting(false);
            return;
        }

        // Convertir fecha de envío a Timestamp correctamente
        const [year, month, day] = fechaEnvio.split('-').map(Number);
        const fechaEnvioDate = new Date(year, month - 1, day);
        const fechaEnvioTimestamp = Timestamp.fromDate(fechaEnvioDate);

        const nuevoRegistro = {
            ticket,
            tipo_envio: tipoEnvio,
            estado_empaque: estadoEmpaque,
            fecha_envio: fechaEnvioTimestamp,
            costo_pedido: parseFloat(costoPedido),
            nombre,
            telefono,
            distrito,
            dedicatoria,
            empaque_regalo: empaqueRegalo,
            estado_tracking: estadoTracking,
            cod_tracking: codTracking,
            nro_seguimiento: nroSeguimiento,
            clave_recojo: claveRecojo,
        };

        try {
            await addDoc(collection(db, 'registro-clientes'), nuevoRegistro);
            toast.success('Registro añadido exitosamente');
            onClose();
        } catch (error) {
            toast.error('Error añadiendo el registro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-md font-medium px-1 mb-3 text-center">Nuevo Registro</h3>

                {/* Sección Principal - 2 columnas */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Fila 1 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">N° Pedido</label>
                        <input
                            value={ticket}
                            onChange={(e) => setTicket(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Tipo Envío</label>
                        <select
                            value={tipoEnvio}
                            onChange={(e) => setTipoEnvio(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
                            required
                        >
                            {opcionesTipoEnvio.map(opcion => (
                                <option key={opcion} value={opcion} className="text-sm">{opcion}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fila 2 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Estado</label>
                        <select
                            value={estadoEmpaque}
                            onChange={(e) => setEstadoEmpaque(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
                            required
                        >
                            {opcionesEstadoEmpaque.map(opcion => (
                                <option key={opcion} value={opcion} className="text-sm">{opcion}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Fecha</label>
                        <input
                            type="date"
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                            required
                        />
                    </div>

                    {/* Fila 3 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Nombre</label>
                        <input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Teléfono</label>
                        <input
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                        />
                    </div>

                    {/* Fila 4 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Distrito</label>
                        <input
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">Total</label>
                        <div className="flex border border-gray-200 rounded-md bg-white">
                            <span className="bg-gray-100 px-2 py-1.5 text-sm text-sm border-r">S/</span>
                            <input
                                type="number"
                                value={costoPedido}
                                onChange={(e) => setCostoPedido(e.target.value)}
                                className="w-full p-2 text-sm focus:outline-none"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Checkboxes en línea */}
                <div className="grid grid-cols-2 gap-2">
                    <div
                        className="flex items-center p-2 bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => setEmpaqueRegalo(!empaqueRegalo)}
                    >
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                            className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-gray-700 cursor-pointer">
                            Regalo
                        </label>
                    </div>

                    <div
                        className="flex items-center p-2 bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => setDedicatoria(!dedicatoria)}
                    >
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                            className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-gray-700 cursor-pointer">
                            Dedicatoria
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-primary-button text-white py-2.5 rounded-xl w-full h-12 text-sm font-medium
                     active:scale-95 transition-transform disabled:opacity-70"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        'Crear Registro'
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default AddRecordModal;
