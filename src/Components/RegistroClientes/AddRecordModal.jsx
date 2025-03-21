import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { addDoc, collection, Timestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { toast } from 'react-toastify';

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
            console.error('Error verificando el ticket:', error);
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
            console.error('Error añadiendo el registro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold">Nuevo Registro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-700">Pedido #:</label>
                        <input
                            type="text"
                            value={ticket}
                            onChange={(e) => setTicket(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Tipo de Envío:</label>
                        <select
                            value={tipoEnvio}
                            onChange={(e) => setTipoEnvio(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {opcionesTipoEnvio.map((opcion) => (
                                <option key={opcion} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Estado de Empaque:</label>
                        <select
                            value={estadoEmpaque}
                            onChange={(e) => setEstadoEmpaque(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {opcionesEstadoEmpaque.map((opcion) => (
                                <option key={opcion} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Fecha de Envío:</label>
                        <input
                            type="date"
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-700">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Teléfono:</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-700">Distrito:</label>
                        <input
                            type="text"
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Precio del Pedido:</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <span className="bg-gray-200 text-gray-700 px-3 py-2 border-r border-gray-300">S/</span>
                            <input
                                type="number"
                                value={costoPedido}
                                onChange={(e) => setCostoPedido(e.target.value)}
                                required
                                className="w-full p-2 focus:outline-none rounded-md"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center p-2 bg-bg-base-white rounded-md" onClick={() => setEmpaqueRegalo(!empaqueRegalo)}>
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                            className="mr-2"
                        />
                        <label
                            className="text-gray-700"
                            onClick={() => setEmpaqueRegalo(!empaqueRegalo)}
                        >
                            Empaque Regalo
                        </label>
                    </div>
                    <div className="flex items-center p-2 bg-bg-base-white rounded-md" onClick={() => setDedicatoria(!dedicatoria)}>
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                            className="mr-2"
                        />
                        <label
                            className="text-gray-700"
                            onClick={() => setDedicatoria(!dedicatoria)}
                        >
                            Dedicatoria
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-accent-secondary text-accent-secondary-dark py-2 px-4 rounded-md w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Agregando...' : 'Agregar Registro'}
                </button>
            </form>
        </Modal >
    );
};

export default AddRecordModal;
