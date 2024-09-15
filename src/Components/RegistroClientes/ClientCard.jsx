import React, { useState } from 'react';
import DetailsModal from './DetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdRemoveRedEye, MdOutlineSync, MdDelete, MdCardGiftcard } from "react-icons/md";
import { formatFirestoreDateWithDay } from '../../utils/helpers'; // Importa la función

function getStatusClass(estadoEmpaque) {
    switch (estadoEmpaque) {
        case 'Empacado listo':
            return 'bg-yellow-200 text-yellow-800';
        case 'Pendiente':
            return 'bg-red-200 text-red-800';
        case 'Enviado':
            return 'bg-green-200 text-green-800';
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

    const verifyEmpaque = () => {
        return client.empaque_regalo === true;
    }

    return (
        <div className="border border-gray-300 shadow-lg rounded-3xl p-4 mb-4 bg-input-bg">
            <div className="card-header">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold text-text-primary">{client.nombre}</h2>
                    {verifyEmpaque() && (
                        <MdCardGiftcard size={24} />
                    )}
                </div>
                <h3 className="text-md text-gray-500">#{client.ticket}</h3>
            </div>
            <div className="my-2">
                <div className="info-row">
                    <span className="font-bold text-text-primary">Courier:</span>
                    <span className="ml-2 text-text-primary">{client.tipo_envio}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Estado de Empaque:</span>
                    <span className={`${getStatusClass(client.estado_empaque)} ml-2 p-1 rounded text-text-primary`}>{client.estado_empaque}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Día de envío:</span>
                    <span className="ml-2 text-text-primary">{formatFirestoreDateWithDay(client.dia_envio)}</span> {/* Aquí usas la nueva función */}
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Tracking:</span>
                    <span className={`${getStatusClass(client.estado_tracking)} ml-2 p-1 rounded text-text-primary`}>{client.estado_tracking}</span>
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <button className="flex items-center justify-center gap-2 text-text-contrast border border-text-contrast bg-transparent rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans hover:bg-text-contrast hover:text-white transition duration-300" onClick={toggleModal}>
                    <MdRemoveRedEye size={24} /> Ver Detalles
                </button>
                <button className="flex items-center justify-center gap-2 text-text-contrast border border-text-contrast bg-transparent rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans hover:bg-text-contrast hover:text-white transition duration-300" onClick={handleUpdateClick}>
                    <MdOutlineSync size={24} /> Cambiar Estado
                </button>

                <button className="bg-accent-primary text-white p-1 px-2 rounded hover:bg-red-600 transition duration-300" onClick={handleDeleteClick}>
                    <MdDelete size={20} />
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
