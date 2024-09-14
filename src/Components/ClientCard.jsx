import React, { useState } from 'react';
import DetailsModal from './DetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

function getStatusClass(estadoEmpaque) {
    switch (estadoEmpaque) {
        case 'Empacado listo':
            return 'bg-green-200 text-green-800';
        case 'Pendiente':
            return 'bg-yellow-200 text-yellow-800';
        case 'Enviado':
            return 'bg-blue-200 text-blue-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}

const ClientCard = ({ client }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
        <div className="border border-gray-300 shadow-lg rounded-lg p-4 mb-4 bg-bg-base">
            <div className="card-header">
                <h2 className="text-xl font-semibold text-text-primary">{client.nombre}</h2>
                <h3 className="text-md text-gray-500">#{client.ticket}</h3>
            </div>
            <div className="my-2">
                <div className="info-row">
                    <span className="font-medium text-text-primary">Courier:</span>
                    <span className="ml-2 text-text-primary">{client.tipo_envio}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-medium text-text-primary">Estado de Empaque:</span>
                    <span className={`${getStatusClass(client.estado_empaque)} ml-2 p-1 rounded text-text-primary`}>{client.estado_empaque}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-medium text-text-primary">Destino:</span>
                    <span className="ml-2 text-text-primary">{client.distrito}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-medium text-text-primary">Total del Pedido:</span>
                    <span className="ml-2 text-text-primary">S/. {client.costo_pedido}</span>
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <button className="bg-accent-primary text-white p-2 rounded hover:bg-accent-warm transition duration-300" onClick={toggleModal}>
                    Ver detalles
                </button>
                <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300" onClick={handleUpdateClick}>
                    Actualizar Estado
                </button>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300" onClick={handleDeleteClick}>
                    Eliminar
                </button>
            </div>

            {/* Modal con todos los detalles del cliente */}
            <DetailsModal isOpen={isModalOpen} onClose={toggleModal} client={client} />

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
