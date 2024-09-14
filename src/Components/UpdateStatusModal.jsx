import React, { useState } from 'react';
import Modal from './Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const UpdateStatusModal = ({ isOpen, onClose, client }) => {
    const [codTracking, setCodTracking] = useState(client.cod_tracking || '');
    const [nroSeguimiento, setNroSeguimiento] = useState(client.nro_seguimiento || '');
    const [claveRecojo, setClaveRecojo] = useState(client.clave_recojo || '');
    const [estadoEmpaque, setEstadoEmpaque] = useState(client.estado_empaque || 'Empaque Pendiente');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Opciones para Estado de Empaque
    const opcionesEstadoEmpaque = [
        'Empaque Pendiente',
        'Empacado Listo',
        'Documentado',
        'Enviado',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const docRef = doc(db, 'registro-clientes', client.id);

        try {
            await updateDoc(docRef, {
                cod_tracking: codTracking,
                nro_seguimiento: nroSeguimiento,
                clave_recojo: claveRecojo,
                estado_empaque: estadoEmpaque,
            });
            alert('Estado actualizado exitosamente');
            onClose();
        } catch (error) {
            console.error('Error actualizando el estado:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Actualizar Estado</h3>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Código de Tracking:</label>
                    <input
                        type="text"
                        value={codTracking}
                        onChange={(e) => setCodTracking(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Número de Seguimiento:</label>
                    <input
                        type="text"
                        value={nroSeguimiento}
                        onChange={(e) => setNroSeguimiento(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Clave de Recojo:</label>
                    <input
                        type="text"
                        value={claveRecojo}
                        onChange={(e) => setClaveRecojo(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Estado de Empaque:</label>
                    <select
                        value={estadoEmpaque}
                        onChange={(e) => setEstadoEmpaque(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        {opcionesEstadoEmpaque.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent-primary text-white w-full p-2 rounded-md mt-4 disabled:opacity-50"
                >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                </button>
            </form>
        </Modal>
    );
};

export default UpdateStatusModal;
