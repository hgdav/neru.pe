import React, { useState, useEffect } from 'react';
import DetailsModal from './DetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import { MdRemoveRedEye, MdChecklistRtl, MdCardGiftcard, MdImageAspectRatio, MdLocationPin } from "react-icons/md";
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
            return 'bg-bg-base-white text-accent-primary-dark';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}

function getCourierImg(tipo_envio) {
    switch (tipo_envio) {
        case 'Olva Courier':
            return '/img/olva.png';
        case 'Shalom':
            return '/img/shalom.ico';
        case 'GoPack':
            return '/img/gopack.png';
        case 'InDrive':
            return '/img/indrive.png';
        default:
            return 'logo.svg';
    }
}

const ClientCard = ({ client }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [isntMobile, setIsntMobile] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsntMobile(window.innerWidth >= 768);
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

    const verifyEmpaque = () => {
        return client.empaque_regalo === true;
    };

    const verifyDedicatoria = () => {
        return client.dedicatoria === true;
    };

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
                            <div className="text-sm text-gray-500 inline-flex items-center gap-1">
                                <div className='rounded-full bg-bg-base-white p-1'>
                                    <img src={getCourierImg(client.tipo_envio)} alt="Logo del Courier" className="w-8 h-8 rounded-full" />
                                </div>
                                {fechaEnvioString}
                            </div>
                            <div className="inline-flex items-center gap-1">
                                {verifyEmpaque() && <MdCardGiftcard size={24} />}
                                {verifyDedicatoria() && <MdImageAspectRatio size={24} />}
                            </div>
                        </div>
                    </div>
                    <div className="my-2">
                        <h3 className="text-lg text-gray-500 font-semibold mb-1">#{client.ticket}</h3>
                        <h2 className="text-xl font-semibold text-text-primary">{client.nombre}</h2>

                        <div className="info-row mt-2">
                            <span className="font-bold text-text-primary">Empaque:</span>
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
                        <div className="info-row mt-2 flex items-center">
                            <span className="font-bold text-text-primary"><MdLocationPin size={22} /></span>
                            <span className="ml-2 text-text-primary font-bold">{client.distrito.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 sm:gap-4 mt-6">
                        <button
                            className="flex items-center gap-1 text-button-bg rounded-xl px-2 py-1 sm:px-4 sm:py-2 transition-all duration-200 group relative"
                            onClick={toggleModal}
                        >
                            <MdRemoveRedEye size={18} className="opacity-80 group-hover:opacity-100" />
                            <span className="hidden sm:inline text-sm relative">
                                Detalles
                                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </span>
                        </button>

                        <button
                            className="flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-2 transition-all duration-200 group relative"
                            onClick={handleUpdateClick}
                        >
                            <MdChecklistRtl size={24} className="opacity-80 group-hover:opacity-100" />
                            <span className="hidden sm:inline relative">
                                Seguimiento
                                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </span>
                        </button>
                    </div>

                    {/* Modal con todos los detalles del cliente */}
                    <DetailsModal isOpen={isModalOpen}
                        onClose={toggleModal}
                        client={client} />

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
                <div className="rounded-3xl p-3 bg-bg-base-white">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <div className='rounded-full bg-bg-base-white p-0.5'>
                                <img src={getCourierImg(client.tipo_envio)} alt="Logo del Courier" className="w-5 h-5 rounded-full" />
                            </div>
                            <div className="text-xs text-gray-500">{fechaEnvioString}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            {verifyEmpaque() && <MdCardGiftcard size={18} />}
                            {verifyDedicatoria() && <MdImageAspectRatio size={18} />}
                        </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-1.5">
                            <p className="text-xs text-muted-foreground">
                                <b>#{client.ticket}</b>
                            </p>
                            <p className="text-xs text-muted-foreground font-bold">
                                - {client.distrito.toUpperCase()}
                            </p>
                        </div>
                        <p className="font-medium text-sm">{client.nombre}</p>

                        <div className="font-xs">
                            <span
                                className={`${getStatusClass(client.estado_tracking)} py-0.5 rounded text-xs`}
                            >
                                Tracking: {client.estado_tracking}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            className="flex items-center gap-1 text-button-bg rounded-xl px-2 py-1 transition-all duration-200 group relative"
                            onClick={toggleModal}
                        >
                            <MdRemoveRedEye size={18} className="opacity-80 group-hover:opacity-100" />
                            <span className="text-sm relative">
                                Detalles
                                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </span>
                        </button>
                        <button
                            className="flex items-center gap-1 text-button-bg rounded-xl px-2 py-1 transition-all duration-200 group relative"
                            onClick={handleUpdateClick}
                        >
                            <MdChecklistRtl size={18} className="opacity-80 group-hover:opacity-100" />
                            <span className="text-sm relative">
                                Seguimiento
                                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </span>
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
            )}
        </div>
    );

};

export default ClientCard;
