import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import toast from 'react-hot-toast';
import { MdContentCopy, MdWhatsapp } from 'react-icons/md';


const UpdateStatusModal = ({ isOpen, onClose, client }) => {
    const [codTracking, setCodTracking] = useState(client.cod_tracking || '');
    const [nroSeguimiento, setNroSeguimiento] = useState(client.nro_seguimiento || '');
    const [claveRecojo, setClaveRecojo] = useState(client.clave_recojo || '');
    const [estadoEmpaque, setEstadoEmpaque] = useState(client.estado_empaque || 'Empaque Pendiente');
    const [estadoTracking, setEstadoTracking] = useState(client.estado_tracking || 'Pendiente');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [costoEnvio, setCostoEnvio] = useState(client.costo_envio || '');
    const [mensajeWsp, setMensajeWsp] = useState('');

    // Opciones para Estado de Empaque
    const opcionesEstadoEmpaque = [
        'Pendiente',
        'Empacado Listo',
        'Documentado',
        'Enviado',
    ];

    // Lógica para actualizar mensajeWsp basada en el tipo de envío y datos
    useEffect(() => {
        let mensaje = '';
        if (client.tipo_envio === 'Olva Courier') {
            if (codTracking && nroSeguimiento && claveRecojo) {
                mensaje = `¡Hola! Bienvenid@ al WhatsApp oficial de Nerū 👕 

Te saluda David Hurtado agente logístico 🙋🏻‍♂️ .

✅ Este es tu número de TRACKING: ${codTracking} y esta es tu CLAVE DE SEGURIDAD: ${claveRecojo} recuerda llevar tu DNI en físico para poder recoger tu pedido en la agencia de OLVA COURIER.

✅ Para verificar el estado de tu envio, ingresa aqui 👉🏻 https://tracking.olvaexpress.pe/  coloca el número de tracking y año de emisión.

📌 Cualquier otra duda que tengas nos la haces saber por favor 👍🏻.`;

            } else {
                mensaje = `¡Hola! Bienvenid@ al WhatsApp oficial de Nerū 👕 

Te saluda David Hurtado agente logístico 🙋🏻‍♂️ .

✅ Este es tu número de TRACKING: ${codTracking}.   

✅ Para verificar el estado de tu envio, ingresa aqui 👉🏻 https://tracking.olvaexpress.pe/  coloca el número de tracking y año de emisión.

📌 Cualquier otra duda que tengas nos la haces saber por favor 👍🏻.`
            }
        } else if (client.tipo_envio === 'Shalom') {
            mensaje = `¡Hola! te saluda David Hurtado agente logístico de Neru 🙋🏻‍♂️. 

✅ Este es tu nro. de orden: ${nroSeguimiento} tu código es: ${codTracking}, la clave de seguridad es: ${claveRecojo}, recuerda llevar tu DNI en físico para poder recoger tu pedido en la agencia de SHALOM.

✅ Para verificar el estado de tu envio, ingresa aqui 👉🏻 https://rastrea.shalom.pe/  coloca el número de ORDEN y CODIGO.

📌 Cualquier otra duda que tengas nos la haces saber por favor 👍🏻`;
        } else {
            mensaje = "Aún no cuenta con códigos de seguimiento"
        }
        setMensajeWsp(mensaje);
    }, [client.tipo_envio, nroSeguimiento, codTracking, claveRecojo]);

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
                estado_tracking: estadoTracking,
                costo_envio: costoEnvio,
            });
            toast.success('Actualizado correctamente');
            onClose();
        } catch (error) {
            toast.error('Error actualizando el estado:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [copied, setCopied] = useState(false);
    const [copiado, setCopiado] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(client.telefono).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header con espaciado mejorado */}
                <div className="relative pb-4 border-b">
                    <h3 className="text-lg font-medium pr-10">Seguimiento - #{client.ticket}</h3>

                    <div
                        className="absolute top-0 right-0 cursor-pointer transform hover:scale-105"
                        onClick={handleCopyClick}
                    >
                        <MdWhatsapp
                            className={`transition-transform duration-150 ${copied ? 'text-green-800 scale-110' : 'text-green-600'}`}
                            size={26}
                            title='Copiar número de WhatsApp'
                        />
                    </div>
                </div>

                {/* Grid principal con espaciado óptimo */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Columna Izquierda */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">Código Tracking</label>
                            <input
                                value={codTracking}
                                onChange={(e) => setCodTracking(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-accent-secondary"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">Clave Recojo</label>
                            <input
                                value={claveRecojo}
                                onChange={(e) => setClaveRecojo(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-accent-secondary"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">Estado Tracking</label>
                            <select
                                value={estadoTracking}
                                onChange={(e) => setEstadoTracking(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-accent-secondary"
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Enviado">Enviado</option>
                            </select>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                N° Registro
                                <MdContentCopy
                                    size={16}
                                    className="ml-1.5 inline cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
                                    onClick={() => navigator.clipboard.writeText('TRACKING:' + codTracking + ' - ' + nroSeguimiento)}
                                    title='Copia códigos de seguimiento para Shoppify'
                                />
                            </label>
                            <input
                                value={nroSeguimiento}
                                onChange={(e) => setNroSeguimiento(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-accent-secondary"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">Costo Envío</label>
                            <div className="flex border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-accent-secondary">
                                <span className="bg-gray-200 px-2.5 py-2.5 text-sm border-r">S/</span>
                                <input
                                    type="number"
                                    value={costoEnvio}
                                    onChange={(e) => setCostoEnvio(e.target.value)}
                                    className="w-full p-2 focus:outline-none text-sm"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600 mb-1.5">Estado Empaque</label>
                            <select
                                value={estadoEmpaque}
                                onChange={(e) => setEstadoEmpaque(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-accent-secondary"
                            >
                                {opcionesEstadoEmpaque.map(opcion => (
                                    <option key={opcion} value={opcion}>{opcion}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Botones con espaciado perfecto */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary-button text-white py-2.5 rounded-xl w-full text-sm font-medium
                     active:scale-95 transition-transform disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" fill="currentColor" />
                                    <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" />
                                </svg>
                                Actualizando...
                            </span>
                        ) : 'Actualizar'}
                    </button>

                    <div
                        onClick={() => {
                            navigator.clipboard.writeText(mensajeWsp);
                            setCopiado(true);
                            setTimeout(() => setCopiado(false), 1000);
                        }}
                        className="flex items-center justify-center p-2.5 bg-primary-button text-white w-12 h-12 rounded-xl cursor-pointer hover:bg-opacity-90 transition-opacity"
                    >
                        <MdContentCopy className={`text-lg transition-transform duration-150 ease-out ${copiado ? 'scale-125' : ''}`} />
                    </div>
                </div>
            </form>

        </Modal>
    );
};

export default UpdateStatusModal;
