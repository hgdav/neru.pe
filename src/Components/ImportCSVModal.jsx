import React, { useState } from 'react';
import Modal from './Modal';
import { addDoc, collection, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

const ImportCSVModal = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Por favor, seleccione un archivo CSV.');
            return;
        }

        setIsSubmitting(true);

        // Parsear el archivo CSV
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                const data = results.data;

                // Validar que haya datos
                if (!data || data.length === 0) {
                    toast.error('El archivo CSV está vacío o no contiene datos válidos.');
                    setIsSubmitting(false);
                    return;
                }

                let registrosExitosos = 0;
                let registrosFallidos = 0;

                // Procesar cada fila
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];

                    // Extraer campos
                    const ticket = row.ticket;
                    const tipoEnvio = row.tipo_envio || 'Olva Courier';
                    const estadoEmpaque = row.estado_empaque || 'Pendiente';
                    const fechaEnvioStr = row.fecha_envio;
                    const costoPedido = parseFloat(row.costo_pedido || 0);
                    const nombre = row.nombre;
                    const telefono = row.telefono;
                    const distrito = row.distrito;
                    const dedicatoria = row.dedicatoria === 'true' || row.dedicatoria === 'TRUE' || row.dedicatoria === '1';
                    const empaqueRegalo = row.empaque_regalo === 'true' || row.empaque_regalo === 'TRUE' || row.empaque_regalo === '1';
                    const codTracking = row.cod_tracking || '';
                    const nroSeguimiento = row.nro_seguimiento || '';
                    const claveRecojo = row.clave_recojo || '';
                    const estadoTracking = row.estado_tracking || 'Pendiente';
                    const costoEnvio = row.costo_envio || 0;

                    // Validar campos requeridos
                    if (!ticket || !nombre || !telefono || telefono === '0' || !distrito || !fechaEnvioStr) {
                        toast.error(`Faltan campos requeridos en la fila ${i + 1}.`);
                        registrosFallidos++;
                        continue;
                    }


                    // Convertir fecha_envio a Timestamp
                    let fechaEnvioTimestamp;
                    try {
                        const [day, month, year] = fechaEnvioStr.split('/').map(Number);
                        const fechaEnvioDate = new Date(year, month - 1, day);

                        fechaEnvioTimestamp = Timestamp.fromDate(fechaEnvioDate);
                    } catch (error) {
                        toast.error(`Fecha de envío inválida en la fila ${i + 1}.`);
                        registrosFallidos++;
                        continue;
                    }

                    // Verificar si el ticket ya existe
                    try {
                        const q = query(
                            collection(db, 'registro-clientes'),
                            where('ticket', '==', ticket)
                        );
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            toast.error(`El número de pedido ${ticket} ya existe(fila ${i + 1}).`);
                            registrosFallidos++;
                            continue;
                        }
                    } catch (error) {
                        console.error('Error verificando el ticket:', error);
                        toast.error(`Error verificando el ticket en la fila ${i + 1}.`);
                        registrosFallidos++;
                        continue;
                    }

                    // Crear nuevo registro
                    const nuevoRegistro = {
                        ticket,
                        tipo_envio: tipoEnvio,
                        estado_empaque: estadoEmpaque,
                        fecha_envio: fechaEnvioTimestamp,
                        costo_pedido: costoPedido,
                        nombre,
                        telefono,
                        distrito,
                        dedicatoria,
                        empaque_regalo: empaqueRegalo,
                        fecha: Timestamp.now(),
                        estado_tracking: estadoTracking,
                        cod_tracking: codTracking,
                        nro_seguimiento: nroSeguimiento,
                        clave_recojo: claveRecojo,
                        costo_envio: costoEnvio,
                    };

                    try {
                        await addDoc(collection(db, 'registro-clientes'), nuevoRegistro);
                        registrosExitosos++;
                    } catch (error) {
                        console.error('Error añadiendo el registro:', error);
                        toast.error(`Error añadiendo el registro en la fila ${i + 1}.`);
                        registrosFallidos++;
                    }
                }

                toast.success(`Importación completada: ${registrosExitosos} exitosos, ${registrosFallidos} fallidos.`);
                setIsSubmitting(false);
                onClose();
            },
            error: function (error) {
                console.error('Error al leer el archivo CSV:', error);
                toast.error('Error al leer el archivo CSV.');
                setIsSubmitting(false);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold">Importar Registros desde CSV</h3>
                <div>
                    <label className="block mb-1 text-gray-700">Seleccionar archivo CSV:</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-accent-secondary text-accent-secondary-dark py-2 px-4 rounded-md w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Importando...' : 'Importar Registros'}
                </button>
            </form>
        </Modal>
    );
};

export default ImportCSVModal;