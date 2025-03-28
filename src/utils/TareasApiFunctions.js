import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Función para obtener todas las tareas
export const getTasks = async () => {
    const tasksCollection = collection(db, 'tareas-usuario');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasksList;
};

// Función para agregar una nueva tarea
export const addTask = async (task) => {
    const tasksCollection = collection(db, 'tareas-usuario');
    const docRef = await addDoc(tasksCollection, task);
    return { id: docRef.id, ...task };
};

// Función para actualizar una tarea
export const updateTask = async (id, updatedTask) => {
    const taskDoc = doc(db, 'tareas-usuario', id);
    await updateDoc(taskDoc, updatedTask);
};

// Función para eliminar una tarea
export const deleteTask = async (id) => {
    const taskDoc = doc(db, 'tareas-usuario', id);
    await deleteDoc(taskDoc);
};
