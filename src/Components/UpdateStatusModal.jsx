import React, { useState } from 'react';
import Modal from './Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const UpdateStatusModal = ({ isOpen, onClose, client }) => {
    const [codTracking, setCodTracking] = useState(client.cod_tracking || '');
    const [nroSeguimiento, setNroSeguimiento] = useState(client.nro_seguimiento || '');
    const [claveRecojo, setClaveRecojo] = useState(client.clave_recojo || '');
    const [estadoEmpaque, setEstadoEmpaque] = useState(client.estado_empaque || 'Empaque Pendiente');
    const [estadoEnvio, setEstadoEnvio] = useState(client.estado_envio || '');
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
                estado_envio: estadoEnvio,
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
            <form onSubmit={handleSubmit}>
                <h3>Actualizar Estado</h3>
                <div>
                    <label>Código de Tracking:</label>
                    <input
                        type="text"
                        value={codTracking}
                        onChange={(e) => setCodTracking(e.target.value)}
                    />
                </div>
                <div>
                    <label>Número de Seguimiento:</label>
                    <input
                        type="text"
                        value={nroSeguimiento}
                        onChange={(e) => setNroSeguimiento(e.target.value)}
                    />
                </div>
                <div>
                    <label>Clave de Recojo:</label>
                    <input
                        type="text"
                        value={claveRecojo}
                        onChange={(e) => setClaveRecojo(e.target.value)}
                    />
                </div>
                <div>
                    <label>Estado de Empaque:</label>
                    <select
                        value={estadoEmpaque}
                        onChange={(e) => setEstadoEmpaque(e.target.value)}
                        required
                    >
                        {opcionesEstadoEmpaque.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                </button>
            </form>
        </Modal>
    );
};

export default UpdateStatusModal;
