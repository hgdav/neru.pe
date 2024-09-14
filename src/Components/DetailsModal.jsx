import React from 'react';
import Modal from './Modal';
import { formatFirestoreTimestamp } from '../utils/helpers';

const DetailsModal = ({ isOpen, onClose, client }) => {
    const formattedDate = formatFirestoreTimestamp(client.fecha);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">{client.nombre}</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Código de Envío:</span>
                    <span className="text-text-contrast">{client.codigo_envio || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Código de Recojo:</span>
                    <span className="text-text-contrast">{client.codigo_recojo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Teléfono:</span>
                    <span className="text-text-contrast">{client.telefono}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Número de Registro:</span>
                    <span className="text-text-contrast">{client.nro_registro || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Tipo de Envío:</span>
                    <span className="text-text-contrast">{client.tipo_envio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Tipo de Empaque:</span>
                    <span className="text-text-contrast">{client.tipo_empaque}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Estado de Empaque:</span>
                    <span className="text-text-contrast">{client.estado_empaque}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Estado de Tracking:</span>
                    <span className="text-text-contrast">{client.estado_tracking || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Destino:</span>
                    <span className="text-text-contrast">{client.distrito}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Total del Pedido:</span>
                    <span className="text-text-contrast">S/. {client.costo_pedido}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Costo de Envío:</span>
                    <span className="text-text-contrast">S/. {client.costo_envio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Dedicatoria:</span>
                    <span className="text-text-contrast">{client.dedicatoria ? 'Sí' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Día de Envío:</span>
                    <span className="text-text-contrast">{client.dia_envio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Fuente:</span>
                    <span className="text-text-contrast">{client.fuente || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-text-primary">Fecha de Registro:</span>
                    <span className="text-text-contrast">{formattedDate}</span>
                </div>
            </div>
        </Modal>

    );
};

export default DetailsModal;
