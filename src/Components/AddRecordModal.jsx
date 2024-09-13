import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { addDoc, collection, Timestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const AddRecordModal = ({ isOpen, onClose }) => {
    const [ticket, setTicket] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [distrito, setDistrito] = useState('');
    const [costoPedido, setCostoPedido] = useState(0);
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [dedicatoria, setDedicatoria] = useState(false);
    const [empaqueRegalo, setEmpaqueRegalo] = useState(false);
    const [fuente, setFuente] = useState('');
    const [tracking, setTracking] = useState('');
    const [registro, setRegistro] = useState('');
    const [clave, setClave] = useState('');
    const [estadoTracking, setEstadoTracking] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Inicializar diaEnvio con el día siguiente al actual (ya implementado anteriormente)
    const [diaEnvio, setDiaEnvio] = useState(() => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        return mañana.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    });

    // Array de días disponibles (próximos 7 días)
    const diasDisponibles = [];
    for (let i = 1; i <= 7; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + i);
        const opciones = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        };
        diasDisponibles.push({
            valor: fecha.toISOString().split('T')[0],
            etiqueta: fecha.toLocaleDateString('es-ES', opciones)
        });
    }

    // Opciones para Tipo de Envío
    const opcionesTipoEnvio = [
        'OLVA COURIER',
        'Shalom',
        'InDrive',
        'GoPack',
        'OTS',
        'Presencial',
    ];

    // Estado inicial de Tipo de Envío
    const [tipoEnvio, setTipoEnvio] = useState('OLVA COURIER');

    // Opciones para Estado de Empaque
    const opcionesEstadoEmpaque = [
        'Empaque Pendiente',
        'Empacado Listo',
        'Documentado',
        'Enviado',
    ];

    // Estado inicial de Estado de Empaque
    const [estadoEmpaque, setEstadoEmpaque] = useState('Empaque Pendiente');

    // Obtener el último ticket cuando el modal se abre
    useEffect(() => {
        const fetchLastTicket = async () => {
            try {
                const q = query(
                    collection(db, 'registro-clientes'),
                    orderBy('ticket', 'desc'),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const lastTicketDoc = querySnapshot.docs[0];
                    const lastTicketData = lastTicketDoc.data();
                    const lastTicketNumber = parseInt(lastTicketData.ticket, 10);
                    setTicket((lastTicketNumber + 1).toString());
                } else {
                    // Si no hay registros previos, comenzamos desde 1
                    setTicket('1');
                }
            } catch (error) {
                console.error('Error obteniendo el último ticket:', error);
            }
        };

        if (isOpen) {
            fetchLastTicket();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        // Verificar si el ticket ya existe
        try {
            const q = query(
                collection(db, 'registro-clientes'),
                where('ticket', '==', ticket)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert('El número de pedido ya existe.');
                setIsSubmitting(false);
                return;
            }
        } catch (error) {
            console.error('Error verificando el ticket:', error);
            setIsSubmitting(false);
            return;
        }

        const nuevoRegistro = {
            ticket,
            nombre,
            telefono,
            distrito,
            costo_pedido: parseFloat(costoPedido),
            costo_envio: parseFloat(costoEnvio),
            dedicatoria,
            dia_envio: diaEnvio,
            empaque_regalo: empaqueRegalo,
            tipo_envio: tipoEnvio,
            estado_empaque: estadoEmpaque,
            fuente,
            tracking,
            registro,
            clave,
            estado_tracking: estadoTracking,
            fecha: Timestamp.now(),
        };

        try {
            await addDoc(collection(db, 'registro-clientes'), nuevoRegistro);
            alert('Registro añadido exitosamente');
            onClose();
        } catch (error) {
            console.error('Error añadiendo el registro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className='input-row'>
                    <div>
                        <h3>Agregar Nuevo Registro</h3>
                    </div>
                    <div>
                        <label>Pedido #:</label>
                        <input
                            type="text"
                            value={ticket}
                            onChange={(e) => setTicket(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Tipo de Envío:</label>
                        <select
                            value={tipoEnvio}
                            onChange={(e) => setTipoEnvio(e.target.value)}
                            required
                        >
                            {opcionesTipoEnvio.map((opcion) => (
                                <option key={opcion} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Estado de Empaque:</label>
                        <select
                            value={estadoEmpaque}
                            onChange={(e) => setEstadoEmpaque(e.target.value)}
                            required
                        >
                            {opcionesEstadoEmpaque.map((opcion) => (
                                <option key={opcion} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Día de Envío:</label>
                        <select
                            value={diaEnvio}
                            onChange={(e) => setDiaEnvio(e.target.value)}
                            required
                        >
                            {diasDisponibles.map((dia) => (
                                <option key={dia.valor} value={dia.valor}>
                                    {dia.etiqueta}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Fuente:</label>
                        <input
                            type="text"
                            value={fuente}
                            onChange={(e) => setFuente(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div className='checkboxes'>
                        <label>Empaque Regalo:</label>
                        <input
                            type="checkbox"
                            checked={empaqueRegalo}
                            onChange={(e) => setEmpaqueRegalo(e.target.checked)}
                        />
                    </div>
                    <div className='checkboxes'>
                        <label>Dedicatoria:</label>
                        <input
                            type="checkbox"
                            checked={dedicatoria}
                            onChange={(e) => setDedicatoria(e.target.checked)}
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Tracking:</label>
                        <input
                            type="text"
                            value={tracking}
                            onChange={(e) => setTracking(e.target.value)}
                        />
                    </div>
                    <div>
                        <label># Registro:</label>
                        <input
                            type="text"
                            value={registro}
                            onChange={(e) => setRegistro(e.target.value)}
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Clave:</label>
                        <input
                            type="text"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Estado Tracking:</label>
                        <input
                            type="text"
                            value={estadoTracking}
                            onChange={(e) => setEstadoTracking(e.target.value)}
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Costo Envío:</label>
                        <input
                            type="number"
                            value={costoEnvio}
                            onChange={(e) => setCostoEnvio(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Costo Pedido:</label>
                        <input
                            type="number"
                            value={costoPedido}
                            onChange={(e) => setCostoPedido(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <label>Distrito:</label>
                <input
                    type="text"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    required
                />

                <button className='btn centre' type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Agregando...' : 'Agregar Registro'}
                </button>
            </form>
        </Modal>
    );
};

export default AddRecordModal;
