import React from 'react';
import { db } from '../../utils/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp

function Calendario() {
    const updateRecords = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'registro-clientes'));
            for (const document of querySnapshot.docs) {
                const data = document.data();
                if (data.dia_envio && !data.fecha_envio) {
                    let fechaEnvioTimestamp = null;

                    if (data.dia_envio instanceof Timestamp) {
                        // Si dia_envio ya es un Timestamp
                        fechaEnvioTimestamp = data.dia_envio;
                    } else if (typeof data.dia_envio === 'string') {
                        // Si dia_envio es una cadena, convertirla a Date y luego a Timestamp
                        const [year, month, day] = data.dia_envio.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        fechaEnvioTimestamp = Timestamp.fromDate(date);
                    } else if (data.dia_envio instanceof Date) {
                        // Si dia_envio es un objeto Date
                        fechaEnvioTimestamp = Timestamp.fromDate(data.dia_envio);
                    } else {
                        console.warn(`El registro ${document.id} tiene un dia_envio de tipo desconocido.`);
                    }

                    await updateDoc(doc(db, 'registro-clientes', document.id), {
                        fecha_envio: fechaEnvioTimestamp,
                        dia_envio: null, // Opcional: puedes eliminar el campo dia_envio
                    });
                    console.log(`Registro ${document.id} actualizado.`);
                }
            }
        } catch (error) {
            console.error('Error actualizando los registros:', error);
        }
    };

    updateRecords();
    return (
        <div>
            <h1>Calendario</h1>
            <button onClick={updateRecords}>Actualizar registros</button>
        </div>
    );
}

export default Calendario;