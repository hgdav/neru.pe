// EventosApiFunctions.js
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Obtener todas las tareas
export const getTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'eventos-calendario'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        return [];
    }
};

// Agregar una nueva tarea
export const addTask = async (task) => {
    try {
        const docRef = await addDoc(collection(db, 'eventos-calendario'), task);
        return { id: docRef.id, ...task };
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        return null;
    }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, 'eventos-calendario', taskId));
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
};
