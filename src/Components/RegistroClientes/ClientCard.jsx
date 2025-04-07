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
                            className="flex items-center gap-1 text-button-bg hover:bg-bg-base rounded-xl px-2 py-1 sm:px-4 sm:py-2 transition-all duration-200 group relative"
                            onClick={toggleModal}
                        >
                            <MdRemoveRedEye size={18} className="opacity-80 group-hover:opacity-100" />
                            <span className="hidden sm:inline text-sm relative">
                                Detalles
                                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </span>
                        </button>

                        <button
                            className="flex items-center gap-2 hover:bg-bg-base rounded-xl px-3 py-2 sm:px-4 sm:py-2 transition-all duration-200 group relative"
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
                                            className="flex items-center justify-center gap-1 text-button-bg border border-solid border-black rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans"
                                            onClick={toggleModal}
                                        >
                                            <MdRemoveRedEye size={18} />
                                            <span className="hidden sm:inline text-sm">Detalles</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-1 text-button-bg border border-solid border-black rounded-lg px-2 py-1 sm:px-4 sm:py-2 font-sans"
                                            onClick={handleUpdateClick}
                                        >
                                            <MdChecklistRtl size={18} />
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
