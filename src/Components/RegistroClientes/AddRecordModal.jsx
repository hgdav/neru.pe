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
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [dedicatoria, setDedicatoria] = useState(false);
    const [empaqueRegalo, setEmpaqueRegalo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Variables adicionales
    const codTracking = '';
    const nroSeguimiento = '';
    const claveRecojo = '';
    const estadoTracking = 'Pendiente';

    const [diaEnvio, setDiaEnvio] = useState(() => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        return mañana.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    });

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

    const [estadoEmpaque, setEstadoEmpaque] = useState('Empaque Pendiente');

    useEffect(() => {
        if (isOpen) {
            // Resetear los campos necesarios
            setNombre('');
            setTelefono('');
            setDistrito('');
            setCostoPedido(0);
            setCostoEnvio(0);
            setDedicatoria(false);
            setEmpaqueRegalo(false);
            setIsSubmitting(false);

            // Establecer la fecha de envío a mañana
            const mañana = new Date();
            mañana.setDate(mañana.getDate() + 1);
            setDiaEnvio(mañana.toISOString().split('T')[0]);

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
                alert('El número de pedido ya existe.');
                setIsSubmitting(false);
                return;
            }
        } catch (error) {
            console.error('Error verificando el ticket:', error);
            setIsSubmitting(false);
            return;
        }

        const nuevoRegistro = {
            ticket,
            tipo_envio: tipoEnvio,
            estado_empaque: estadoEmpaque,
            dia_envio: diaEnvio,
            costo_envio: parseFloat(costoEnvio),
            costo_pedido: parseFloat(costoPedido),
            nombre,
            telefono,
            distrito,
            dedicatoria,
            empaque_regalo: empaqueRegalo,
            fecha: Timestamp.now(),
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
                <h3 className="text-xl font-semibold">Agregar Nuevo Registro</h3>
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
                        <label className="block mb-1 text-gray-700">Día de Envío:</label>
                        <input
                            type="date"
                            value={diaEnvio}
                            onChange={(e) => setDiaEnvio(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-700">Costo Envío:</label>
                        <input
                            type="number"
                            value={costoEnvio}
                            onChange={(e) => setCostoEnvio(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700">Costo Pedido:</label>
                        <input
                            type="number"
                            value={costoPedido}
                            onChange={(e) => setCostoPedido(e.target.value)}
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700" onClick={() => setEmpaqueRegalo(!empaqueRegalo)}>Empaque Regalo</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700" onClick={() => setDedicatoria(!dedicatoria)}>Dedicatoria</label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-warm transition duration-300 w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Agregando...' : 'Agregar Registro'}
                </button>
            </form>
        </Modal>
    );
};

export default AddRecordModal;
