import React, { useState } from 'react';
import Modal from '../Modal';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdContentCopy, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
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
            toast.error('Error actualizando el registro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'registro-clientes', client.id));
            toast.success('Eliminado exitosamente');
        } catch (error) {
            toast.error('Error eliminando el registro:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-md font-medium mb-2 px-1 text-center">{client.nombre}</h3>

                <div className="grid grid-cols-2 gap-2">
                    {/* Fila 1 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Pedido #</label>
                        <input
                            value={ticket}
                            onChange={(e) => setTicket(e.target.value)}
                            className="w-full p-1.5 text-sm border border-gray-200 rounded-md"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Tipo Envío</label>
                        <select
                            value={tipoEnvio}
                            onChange={(e) => setTipoEnvio(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-200 rounded-md"
                        >
                            {opcionesTipoEnvio.map(opcion => (
                                <option key={opcion} value={opcion}>{opcion}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fila 2 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Estado</label>
                        <select
                            value={estadoEmpaque}
                            onChange={(e) => setEstadoEmpaque(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-200 rounded-md"
                        >
                            {opcionesEstadoEmpaque.map(opcion => (
                                <option key={opcion} value={opcion}>{opcion}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Fecha Envío</label>
                        <input
                            type="date"
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            className="w-full p-1.5 text-sm border border-gray-200 rounded-md"
                        />
                    </div>

                    {/* Fila 3 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Costo Envío</label>
                        <div className="flex border border-gray-200 rounded-md">
                            <span className="bg-gray-100 px-2 py-1.5 text-sm">S/</span>
                            <input
                                type="number"
                                value={costoEnvio}
                                onChange={(e) => setCostoEnvio(e.target.value)}
                                className="w-full p-1.5 text-sm focus:outline-none"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Precio Pedido</label>
                        <div className="flex border border-gray-200 rounded-md">
                            <span className="bg-gray-100 px-2 py-1.5 text-sm">S/</span>
                            <input
                                type="number"
                                value={costoPedido}
                                onChange={(e) => setCostoPedido(e.target.value)}
                                className="w-full p-1.5 text-sm focus:outline-none"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Fila 4 */}
                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Teléfono</label>
                        <div className="flex items-center relative">
                            <input
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full p-1.5 text-sm border border-gray-200 rounded-md pr-6"
                            />
                            <MdContentCopy
                                onClick={() => navigator.clipboard.writeText(telefono)}
                                className="absolute right-2 text-gray-500 cursor-pointer"
                                size={16}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs text-gray-600">Distrito</label>
                        <input
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            className="w-full p-1.5 text-sm border border-gray-200 rounded-md"
                        />
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

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="bg-primary-button text-white py-2.5 rounded-xl w-full text-sm font-medium
                     active:scale-95 transition-transform disabled:opacity-70"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" fill="currentColor" />
                                    <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" />
                                </svg>
                                Guardando...
                            </span>
                        ) : 'Guardar'}
                    </button>
                    <button
                        className="flex items-center justify-center p-2.5 bg-primary-button text-white w-12 h-12 rounded-xl cursor-pointer hover:bg-opacity-90 transition-opacity"
                        onClick={handleDeleteClick}
                    >
                        <MdDelete size={16} />
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DetailsModal;
