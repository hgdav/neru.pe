// EventosApiFunctions.js
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Función existente para obtener tareas (sin cambios)
export const getTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'eventos-calendario'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        return [];
    }
};

// Función existente para agregar tareas (sin cambios)
export const addTask = async (task) => {
    try {
        const docRef = await addDoc(collection(db, 'eventos-calendario'), task);
        return { id: docRef.id, ...task };
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        return null;
    }
};

// Función existente para eliminar tareas (sin cambios)
export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, 'eventos-calendario', taskId));
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
};

// NUEVAS FUNCIONES PARA EL SCRUM BOARD
export const actualizarEstadoTarea = async (taskId, nuevoEstado) => {
    try {
        await updateDoc(doc(db, 'eventos-calendario', taskId), {
            status: nuevoEstado
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        throw error;
    }
};

export const crearTareaScrum = async (tarea) => {
    try {
        const docRef = await addDoc(collection(db, 'eventos-calendario'), {
            ...tarea,
            date: new Date()
        });
        return { id: docRef.id, ...tarea };
    } catch (error) {
        console.error('Error al crear tarea Scrum:', error);
        throw error;
    }
};