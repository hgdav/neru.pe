import React, { useState, useEffect } from 'react';
import DetailsModal from './DetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { MdRemoveRedEye, MdChecklistRtl, MdDelete, MdCardGiftcard, MdImageAspectRatio } from "react-icons/md";
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

function getStatusClass(estadoEmpaque) {
    switch (estadoEmpaque) {
        case 'Empacado Listo':
            return 'bg-yellow-200 text-yellow-800';
        case 'Pendiente':
            return 'bg-red-200 text-red-800';
        case 'Enviado':
            return 'bg-accent-primary text-accent-primary-dark';
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

    const [isntMobile, setIsntMobile] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsntMobile(window.innerWidth >= 768); // <= 768px se considera móvil
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const verifyDedicatoria = () => {
        return client.dedicatoria === true;
    };

    // ClientCard.jsx

    const fechaEnvio = client.fecha_envio;
    let fechaEnvioString = 'Sin fecha de envío';

    if (fechaEnvio) {
        let fechaDate;

        if (fechaEnvio instanceof Timestamp) {
            fechaDate = fechaEnvio.toDate();
        } else if (fechaEnvio instanceof Date) {
            fechaDate = fechaEnvio;
        } else if (typeof fechaEnvio === 'string') {
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
        <div>
            {isntMobile ? (
                <div className="rounded-3xl p-6 mb-4 bg-bg-base-white">
                    <div className="card-header border-b border-gray-300 pb-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1">
                                {verifyEmpaque() && <MdCardGiftcard size={24} />}
                                {verifyDedicatoria() && <MdImageAspectRatio size={24} />}
                            </div>
                            <h3 className="text-md text-gray-500">
                                <b>#{client.ticket}</b> | {fechaEnvioString}
                            </h3>
                        </div>
                    </div>
                    <div className="my-2">
                        <h2 className="text-lg font-semibold text-text-primary">{client.nombre}</h2>
                        <div className="info-row mt-2">
                            <span className="font-bold text-text-primary">Courier:</span>
                            <span
                                className={`${getCourierClass(client.tipo_envio)} ml-2 p-1 rounded text-text-primary`}
                            >
                                {client.tipo_envio}
                            </span>
                        </div>
                        <div className="info-row mt-2">
                            <span className="font-bold text-text-primary">Estado de Empaque:</span>
                            <span
                                className={`${getStatusClass(client.estado_empaque)} ml-2 p-1 rounded text-text-primary`}
                            >
                                {client.estado_empaque}
                            </span>
                        </div>
                        <div className="info-row mt-2">
                            <span className="font-bold text-text-primary">Tracking:</span>
                            <span
                                className={`${getStatusClass(client.estado_tracking)} ml-2 p-1 rounded text-text-primary`}
                            >
                                {client.estado_tracking}
                            </span>
                        </div>
                        <div className="info-row mt-2">
                            <span className="font-bold text-text-primary">Destino:</span>
                            <span className="ml-2 text-text-primary">{client.distrito.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            className="flex items-center justify-center gap-2 text-button-bg bg-gray-200 rounded-lg px-4 py-2 sm:px-4 sm:py-2 font-sans"
                            onClick={toggleModal}
                        >
                            <MdRemoveRedEye size={24} />
                            <span className="hidden sm:inline">Detalles</span>
                        </button>

                        <button
                            className="flex items-center justify-center gap-2 text-button-bg bg-gray-200 rounded-lg px-4 py-2 sm:px-4 sm:py-2 font-sans"
                            onClick={handleUpdateClick}
                        >
                            <MdChecklistRtl size={24} />
                            <span className="hidden sm:inline">Seguimiento</span>
                        </button>

                        <button
                            className="text-button-bg bg-gray-200 p-1 px-2 rounded-lg"
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
            ) : (
                <div>
                    <table className="table-auto w-full">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="w-3/4 sm:w-1/2">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <p className="text-xs text-muted-foreground">
                                                <b>#{client.ticket}</b> | {client.distrito.toUpperCase()}
                                            </p>
                                        </div>
                                        <p className="font-medium text-sm sm:text-base">{client.nombre}</p>
                                    </div>
                                </td>
                                <td className="w-1/4 sm:w-1/3 min-w-[150px] px-4">
                                    <div className="flex flex-col gap-1 text-center">
                                        <span
                                            className={`${getCourierClass(client.tipo_envio)} px-1 py-1 rounded text-xs sm:text-sm text-text-primary`}
                                        >
                                            {client.tipo_envio}
                                        </span>
                                        <span
                                            className={`${getStatusClass(client.estado_empaque)} px-1 py-1 rounded text-xs sm:text-sm text-text-primary cursor-pointer`}
                                            onClick={handleUpdateClick}
                                        >
                                            {client.estado_empaque}
                                        </span>
                                    </div>
                                </td>
                                <td className="w-full sm:w-auto">
                                    <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-center">
                                        <button
                                            className="flex items-center justify-center gap-1 text-button-bg bg-gray-200 rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans"
                                            onClick={toggleModal}
                                        >
                                            <MdRemoveRedEye size={16} />
                                            <span className="hidden sm:inline text-sm">Detalles</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-1 text-button-bg bg-gray-200 rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans"
                                            onClick={handleDeleteClick}
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>


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
            )}
        </div>
    );

};

export default ClientCard;
