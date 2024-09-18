import React, { useState } from 'react';
import Modal from '../Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';

const DetailsModal = ({ isOpen, onClose, client }) => {
    // Estados para editar los datos
    const [ticket, setTicket] = useState(client.ticket || '');
    const [codigoTracking, setCodigoTracking] = useState(client.cod_tracking || '');
    const [codigoRecojo, setCodigoRecojo] = useState(client.clave_recojo || '');
    const [telefono, setTelefono] = useState(client.telefono || '');
    const [nroSeguimiento, setNroSeguimiento] = useState(client.nro_seguimiento || '');
    const [tipoEnvio, setTipoEnvio] = useState(client.tipo_envio || 'Olva Courier');
    const [estadoEmpaque, setEstadoEmpaque] = useState(client.estado_empaque || 'Empaque Pendiente');
    const [estadoTracking, setEstadoTracking] = useState(client.estado_tracking || 'Pendiente');
    const [distrito, setDistrito] = useState(client.distrito || '');
    const [costoPedido, setCostoPedido] = useState(client.costo_pedido || 0);
    const [costoEnvio, setCostoEnvio] = useState(client.costo_envio || 0);
    const [dedicatoria, setDedicatoria] = useState(client.dedicatoria || false);
    const [diaEnvio, setDiaEnvio] = useState(client.dia_envio || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [empaqueRegalo, setEmpaqueRegalo] = useState(client.empaque_regalo || false);

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

        const updatedData = {
            ticket,
            telefono,
            tipo_envio: tipoEnvio,
            estado_empaque: estadoEmpaque,
            estado_tracking: estadoTracking,
            distrito,
            costo_pedido: parseFloat(costoPedido),
            costo_envio: parseFloat(costoEnvio),
            dedicatoria,
            dia_envio: diaEnvio,
            empaque_regalo: empaqueRegalo,
            nro_seguimiento: nroSeguimiento,
            cod_tracking: codigoTracking,
            clave_recojo: codigoRecojo,
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
                        <label className="block mb-1 text-text-primary">Día de Envío:</label>
                        <input
                            type="text"
                            value={diaEnvio}
                            onChange={(e) => setDiaEnvio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Costo de Envío:</label>
                        <input
                            type="number"
                            value={costoEnvio}
                            onChange={(e) => setCostoEnvio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Precio del Pedido:</label>
                        <input
                            type="number"
                            value={costoPedido}
                            onChange={(e) => setCostoPedido(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
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
                    <div className="flex items-center p-2">
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700" onClick={() => setEmpaqueRegalo(!empaqueRegalo)}>Empaque Regalo</label>
                    </div>
                    <div className="flex items-center p-2">
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-text-primary" onClick={() => setDedicatoria(!dedicatoria)}>Dedicatoria</label>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Número de Registro:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={nroSeguimiento}
                                onChange={(e) => setNroSeguimiento(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(nroSeguimiento);
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <MdContentCopy />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Tracking:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={codigoTracking}
                                onChange={(e) => setCodigoTracking(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(codigoTracking);
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <MdContentCopy />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-text-primary">Código de Recojo:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={codigoRecojo}
                                onChange={(e) => setCodigoRecojo(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(codigoRecojo);
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <MdContentCopy />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-text-primary">Estado de Tracking:</label>
                        <select
                            value={estadoTracking}
                            onChange={(e) => setEstadoTracking(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Enviado">Enviado</option>
                        </select>
                    </div>

                </div>
                <button
                    type="submit"
                    className="bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-warm transition duration-300 w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Registro'}
                </button>
            </form>
        </Modal>
    );
};

export default DetailsModal;
