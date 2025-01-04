import React, { useState } from 'react';
import Modal from '../Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Timestamp } from 'firebase/firestore';

const DetailsModal = ({ isOpen, onClose, client }) => {
    // Estados para editar los datos
    const [ticket, setTicket] = useState(client.ticket || '');
    const [telefono, setTelefono] = useState(client.telefono || '');
    const [tipoEnvio, setTipoEnvio] = useState(client.tipo_envio || 'Olva Courier');
    const [estadoEmpaque, setEstadoEmpaque] = useState(
        client.estado_empaque || 'Empaque Pendiente'
    );
    const [distrito, setDistrito] = useState(client.distrito || '');
    const [costoPedido, setCostoPedido] = useState(client.costo_pedido || 0);
    const [costoEnvio, setCostoEnvio] = useState(client.costo_envio || 0);
    const [dedicatoria, setDedicatoria] = useState(client.dedicatoria || false);
    const [empaqueRegalo, setEmpaqueRegalo] = useState(client.empaque_regalo || false);
    /*const [estadoTracking, setEstadoTracking] = useState(client.estado_tracking || 'Pendiente');
    const [codigoTracking, setCodigoTracking] = useState(client.cod_tracking || '');
    const [codigoRecojo, setCodigoRecojo] = useState(client.clave_recojo || '');
    const [nroSeguimiento, setNroSeguimiento] = useState(client.nro_seguimiento || '');*/

    // Convertir fecha_envio a 'YYYY-MM-DD' para el input de tipo date
    const [fechaEnvio, setFechaEnvio] = useState(() => {
        let dateString = '';
        if (client.fecha_envio) {
            if (client.fecha_envio instanceof Timestamp) {
                // Si es un Timestamp de Firebase
                dateString = client.fecha_envio.toDate().toISOString().split('T')[0];
            } else if (typeof client.fecha_envio === 'string') {
                // Si ya es una cadena
                dateString = client.fecha_envio;
            }
        }
        return dateString;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const opcionesTipoEnvio = [
        'Olva Courier',
        'Shalom',
        'InDrive',
        'GoPack',
        'OTS',
        'Presencial',
    ];

    const opcionesEstadoEmpaque = [
        'Pendiente',
        'Empacado Listo',
        'Documentado',
        'Enviado',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const docRef = doc(db, 'registro-clientes', client.id);

        // Convertir fechaEnvio a Timestamp si es válida
        let fechaEnvioTimestamp = null;
        if (fechaEnvio) {
            const [year, month, day] = fechaEnvio.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            fechaEnvioTimestamp = Timestamp.fromDate(date);
        }

        const updatedData = {
            ticket,
            telefono,
            tipo_envio: tipoEnvio,
            estado_empaque: estadoEmpaque,
            distrito,
            costo_pedido: parseFloat(costoPedido),
            costo_envio: parseFloat(costoEnvio),
            dedicatoria,
            fecha_envio: fechaEnvioTimestamp,
            empaque_regalo: empaqueRegalo,
            /*estado_tracking: estadoTracking,
            nro_seguimiento: nroSeguimiento,
            cod_tracking: codigoTracking,
            clave_recojo: codigoRecojo,*/
        };

        try {
            await updateDoc(docRef, updatedData);
            toast.success('Actualización correctamente');
            onClose();
        } catch (error) {
            console.error('Error actualizando el registro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{client.nombre}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-text-primary">Pedido #:</label>
                        <input
                            type="text"
                            value={ticket}
                            onChange={(e) => setTicket(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Tipo de Envío:</label>
                        <select
                            value={tipoEnvio}
                            onChange={(e) => setTipoEnvio(e.target.value)}
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
                        <label className="block mb-1 text-text-primary">Estado de Empaque:</label>
                        <select
                            value={estadoEmpaque}
                            onChange={(e) => setEstadoEmpaque(e.target.value)}
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
                        <label className="block mb-1 text-text-primary">Fecha de Envío:</label>
                        <input
                            type="date"
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Costo de Envío:</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <span className="bg-gray-200 text-gray-700 px-3 py-2 border-r border-gray-300">S/</span>
                            <input
                                type="number"
                                value={costoEnvio}
                                onChange={(e) => setCostoEnvio(e.target.value)}
                                className="w-full p-2 focus:outline-none"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Precio del Pedido:</label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <span className="bg-gray-200 text-gray-700 px-3 py-2 border-r border-gray-300">S/</span>
                            <input
                                type="number"
                                value={costoPedido}
                                onChange={(e) => setCostoPedido(e.target.value)}
                                className="w-full p-2 focus:outline-none rounded-md"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Teléfono:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(telefono);
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <MdContentCopy />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Distrito:</label>
                        <input
                            type="text"
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex items-center p-2 bg-bg-base-white rounded-md" onClick={() => setEmpaqueRegalo(!empaqueRegalo)}>
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700">Empaque Regalo</label>
                    </div>
                    <div className="flex items-center p-2 bg-bg-base-white rounded-md" onClick={() => setDedicatoria(!dedicatoria)}>
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700">Dedicatoria</label>
                    </div>

                </div>
                <button
                    type="submit"
                    className="bg-accent-secondary text-accent-secondary-dark py-2 px-4 rounded-md w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Registro'}
                </button>
            </form>
        </Modal>
    );
};

export default DetailsModal;
