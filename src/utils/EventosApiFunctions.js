// EventosApiFunctions.js
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Funciones para el Calendario (Tickets diarios)
export const getCalendarEvents = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'calendar-events'));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() // Convertir Firestore Timestamp a Date
        }));
    } catch (error) {
        console.error('Error al obtener tickets:', error);
        return [];
    }
};

export const addCalendarEvent = async (event) => {
    try {
        const docRef = await addDoc(collection(db, 'calendar-events'), {
            ...event,
            date: event.date || new Date(),
            createdAt: new Date()
        });
        return { id: docRef.id, ...event };
    } catch (error) {
        console.error('Error al crear ticket:', error);
        throw error;
    }
};

export const deleteCalendarEvent = async (eventId) => {
    try {
        await deleteDoc(doc(db, 'calendar-events', eventId));
    } catch (error) {
        console.error('Error al eliminar ticket:', error);
        throw error;
    }
};


export const getTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'eventos-calendario'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        return [];
    }
};

export const addTask = async (task) => {
    try {
        const docRef = await addDoc(collection(db, 'eventos-calendario'), task);
        return { id: docRef.id, ...task };
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        return null;
    }
};

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