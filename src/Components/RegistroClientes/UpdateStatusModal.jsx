import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { toast } from 'react-toastify';
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
            console.error('Error actualizando el estado:', error);
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
                <div
                    onClick={handleCopyClick}
                    className="flex flex-row items-center"
                >
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Seguimiento - #{client.ticket}</h3>
                    <MdWhatsapp className={`mb-4 ml-2 transition-transform duration-100 ease-in-out 
                            ${copied ? 'text-green-800 scale-125' : 'text-green-600'}`} title='Copiar Número de Teléfono para enviar trackeo por WhatsApp' />
                </div>
                <div className='flex flex-row gap-2'>
                    <div className="space-y-2 w-1/2 mt-1">
                        <label className="block text-sm font-medium text-text-primary">Código de Tracking:</label>
                        <input
                            type="text"
                            value={codTracking}
                            onChange={(e) => setCodTracking(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="space-y-2 w-1/2">
                        <label className="block text-sm font-medium text-text-primary inline-flex">Número de Registro:&nbsp; <MdContentCopy size={14} onClick={() => navigator.clipboard.writeText('TRACKING:' + codTracking + ' - ' + nroSeguimiento)} title='Copia códigos de seguimiento para Shoppify' /></label>
                        <input
                            type="text"
                            value={nroSeguimiento}
                            onChange={(e) => setNroSeguimiento(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                </div>
                <div className='flex flex-row gap-2'>
                    <div className="space-y-2 w-1/2">
                        <label className="block text-sm font-medium text-text-primary">Clave de Recojo:</label>
                        <input
                            type="text"
                            value={claveRecojo}
                            onChange={(e) => setClaveRecojo(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="space-y-2 w-1/2">
                        <label className="block text-sm font-medium text-text-primary">Costo de Envío:</label>

                        <div className="flex items-center border border-gray-300 rounded-md">
                            <span className="bg-gray-200 text-gray-700 px-3 py-2 border-r border-gray-300">S/</span>
                            <input
                                type="number"
                                value={costoEnvio}
                                onChange={(e) => setCostoEnvio(e.target.value)}
                                className="w-full p-2 focus:outline-none rounded-md"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Estado de Empaque:</label>
                    <select
                        value={estadoEmpaque}
                        onChange={(e) => setEstadoEmpaque(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        {opcionesEstadoEmpaque.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Tracking:</label>
                    <select
                        value={estadoTracking}
                        onChange={(e) => setEstadoTracking(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                    </select>
                </div>
                <div className='flex flex-row gap-2'>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-accent-secondary text-accent-secondary-dark w-full p-2 rounded-md mt-4 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <div
                        onClick={() => {
                            navigator.clipboard.writeText(mensajeWsp);
                            setCopiado(true);
                            setTimeout(() => setCopiado(false), 1000);
                        }}
                        className="ml-2 flex items-center justify-center p-2 mt-4 bg-text-contrast text-white w-10 h-10 rounded-md cursor-pointer"
                    >
                        <MdContentCopy title='Copiar mensaje de tracking para WhatsApp' className={`transition-transform duration-100 ease-in-out 
                            ${copiado ? ' scale-125' : 'text-white'}`} />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateStatusModal;
