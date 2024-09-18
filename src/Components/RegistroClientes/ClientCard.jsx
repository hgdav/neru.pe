import React, { useState } from 'react';
import DetailsModal from './DetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdRemoveRedEye, MdChecklistRtl, MdDelete, MdCardGiftcard } from "react-icons/md";
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp

function getStatusClass(estadoEmpaque) {
    switch (estadoEmpaque) {
        case 'Empacado Listo':
            return 'bg-yellow-200 text-yellow-800';
        case 'Pendiente':
            return 'bg-red-200 text-red-800';
        case 'Enviado':
            return 'bg-green-200 text-green-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}

function getCourierClass(tipo_envio) {
    switch (tipo_envio) {
        case 'Olva Courier':
            return 'bg-olva-bg text-white';
        case 'Shalom':
            return 'bg-shalom-bg text-white';
        case 'GoPack':
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
            toast.success('Eliminado exitosamente');
        } catch (error) {
            console.error('Error eliminando el registro:', error);
        }
    };

    const verifyEmpaque = () => {
        return client.empaque_regalo === true;
    };

    // ClientCard.jsx

    const fechaEnvio = client.fecha_envio;
    let fechaEnvioString = 'Sin fecha de envío';

    if (fechaEnvio) {
        let fechaDate;

        if (fechaEnvio instanceof Timestamp) {
            // Si es un Timestamp
            fechaDate = fechaEnvio.toDate();
        } else if (fechaEnvio instanceof Date) {
            // Si es un objeto Date
            fechaDate = fechaEnvio;
        } else if (typeof fechaEnvio === 'string') {
            // Si es una cadena, intentar parsearla
            const [year, month, day] = fechaEnvio.split('-').map(Number);
            fechaDate = new Date(year, month - 1, day);
        } else {
            console.warn(`Tipo desconocido para fecha_envio: ${typeof fechaEnvio}`);
        }

        if (fechaDate) {
            fechaEnvioString = format(fechaDate, 'EEEE, d MMMM yyyy', { locale: es });
        }
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
                    <span className={`${getCourierClass(client.tipo_envio)}  ml-2 p-1 rounded text-text-primary`}>{client.tipo_envio}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Estado de Empaque:</span>
                    <span className={`${getStatusClass(client.estado_empaque)} ml-2 p-1 rounded text-text-primary`}>{client.estado_empaque}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Fecha de envío:</span>
                    <span className="ml-2 text-text-primary">{fechaEnvioString}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Tracking:</span>
                    <span className={`${getStatusClass(client.estado_tracking)} ml-2 p-1 rounded text-text-primary`}>{client.estado_tracking}</span>
                </div>
                <div className="info-row mt-2">
                    <span className="font-bold text-text-primary">Distrito:</span>
                    <span className="ml-2 text-text-primary">{client.distrito.toUpperCase()}</span>
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="flex items-center justify-center gap-2 text-text-contrast border border-text-contrast bg-transparent rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans hover:bg-text-contrast hover:text-white transition duration-300"
                    onClick={toggleModal}
                >
                    <MdRemoveRedEye size={24} />
                    <span className="hidden sm:inline">Ver Detalles</span>
                </button>

                <button
                    className="flex items-center justify-center gap-2 text-text-contrast border border-text-contrast bg-transparent rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans hover:bg-text-contrast hover:text-white transition duration-300"
                    onClick={handleUpdateClick}
                >
                    <MdChecklistRtl size={24} />
                    <span className="hidden sm:inline">Cambiar Estado</span>
                </button>

                <button
                    className="text-text-contrast border border-text-contrast bg-transparent p-1 px-2 rounded hover:bg-red-500 transition duration-300"
                    onClick={handleDeleteClick}
                >
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
