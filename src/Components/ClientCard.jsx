import React, { useState } from 'react';
import Modal from './Modal';
import UpdateStatusModal from './UpdateStatusModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

function formatFirestoreTimestamp(timestamp) {
    if (timestamp && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return 'Fecha no disponible';
}

function getStatusClass(estadoEmpaque) {
    switch (estadoEmpaque) {
        case 'Empacado listo':
            return 'status-listo';
        case 'Pendiente':
            return 'status-pendiente';
        case 'Enviado':
            return 'status-enviado';
        default:
            return 'status-desconocido';
    }
}

const ClientCard = ({ client }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const formattedDate = formatFirestoreTimestamp(client.fecha);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const handleUpdateClick = () => {
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'registro-clientes', client.id));
            alert('Registro eliminado exitosamente');
        } catch (error) {
            console.error('Error eliminando el registro:', error);
        }
    };

    return (
        <div className="card-client" data-client-id={client.ticket}>
            <div className="card-header">
                <h2 className="card-title">{client.nombre}</h2>
                <h3 className="card-title">#&nbsp;{client.ticket}</h3>
            </div>
            <div className="card-content">
                <div className="info-row">
                    <span className="info-label">Courier:</span>
                    <span className="info-value">{client.tipo_envio}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Estado de Empaque:</span>
                    <span className={`infoValue ${getStatusClass(client.estado_empaque)}`}>{client.estado_empaque}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Destino:</span>
                    <span className="info-value">{client.distrito}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Total del Pedido:</span>
                    <span className="info-value">S/. {client.costo_pedido}</span>
                </div>
            </div>
            <div className="card-footer">
                <button className="btn btnOutline" onClick={toggleModal}>
                    Ver detalles
                </button>
                <button className="btn btnOutline" onClick={handleUpdateClick}>
                    Actualizar Estado
                </button>
                <button className="btn btnOutline" onClick={handleDeleteClick}>
                    Eliminar
                </button>
            </div>

            {/* Modal con todos los detalles del cliente */}
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <h3>{client.nombre}</h3>
                <div className="infoRow">
                    <span className="infoLabel">#</span>
                    <span className="infoValue">{client.ticket}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Código de Envío:</span>
                    <span className="infoValue">{client.codigo_envio}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Código de Recojo:</span>
                    <span className="infoValue">{client.codigo_recojo}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Teléfono:</span>
                    <span className="infoValue">{client.telefono}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Número de Registro:</span>
                    <span className="infoValue">{client.nro_registro}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Tipo de Envío:</span>
                    <span className="infoValue">{client.tipo_envio}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Tipo de Empaque:</span>
                    <span className="infoValue">{client.tipo_empaque}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Estado de Empaque:</span>
                    <span className="infoValue">{client.estado_empaque}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Estado de Tracking:</span>
                    <span className="infoValue">{client.estado_tracking}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Destino:</span>
                    <span className="infoValue">{client.distrito}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Total del Pedido:</span>
                    <span className="infoValue">S/. {client.costo_pedido}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Costo de Envío:</span>
                    <span className="infoValue">S/. {client.costo_envio}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Dedicatoria:</span>
                    <span className="infoValue">{client.dedicatoria ? 'Sí' : 'No'}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Día de Envío:</span>
                    <span className="infoValue">{client.dia_envio}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Fuente:</span>
                    <span className="infoValue">{client.fuente}</span>
                </div>
                <div className="infoRow">
                    <span className="infoLabel">Fecha de Registro:</span>
                    <span className="infoValue">{formattedDate}</span>
                </div>
            </Modal>

            {/* Modal para actualizar estado */}
            {isUpdateModalOpen && (
                <UpdateStatusModal
                    isOpen={isUpdateModalOpen}
                    onClose={closeUpdateModal}
                    client={client}
                />
            )}
        </div>
    );
};

export default ClientCard;
