import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCircle, MdAddCircle } from 'react-icons/md';
import { getTasks, addTask, updateTask, deleteTask } from '../../utils/TareasApiFunctions';
import { toast } from 'react-toastify';

const users = [
    { id: 1, name: "Jean Pierre" },
    { id: 2, name: "Alex" },
    { id: 3, name: "Diana" },
    { id: 4, name: "David" }
];

const Tareas = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [selectedUser, setSelectedUser] = useState(users[0].id); // Usuario seleccionado

    useEffect(() => {
        // Cargar las tareas cuando el componente se monte
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasks();
                if (fetchedTasks) {
                    setTasks(fetchedTasks);
                }
            } catch (error) {
                toast.error('Error al cargar las tareas');
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            const task = {
                text: newTask,
                completed: false,
                userId: selectedUser, // Asignar tarea al usuario seleccionado
            };
            try {
                const addedTask = await addTask(task);
                if (addedTask) {
                    setTasks((prevTasks) => [...prevTasks, addedTask]);
                    setNewTask('');
                    toast.success('Tarea agregada exitosamente');
                } else {
                    toast.error('Error al agregar la tarea');
                }
            } catch (error) {
                console.error('Error en handleAddTask:', error);
                toast.error('Error al agregar la tarea');
            }
        } else {
            toast.warn('El campo de tarea no puede estar vacío');
        }
    };

    const toggleTaskCompletion = async (id, currentStatus) => {
        try {
            await updateTask(id, { completed: !currentStatus });
            setTasks(
                tasks.map(task => (task.id === id ? { ...task, completed: !currentStatus } : task))
            );
            toast.success('Tarea actualizada exitosamente');
        } catch (error) {
            toast.error('Error al actualizar la tarea');
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        if (confirmDelete) {
            try {
                await deleteTask(id);
                setTasks(tasks.filter(task => task.id !== id)); // Actualizar el estado eliminando la tarea
                toast.success('Tarea eliminada');
            } catch (error) {
                toast.error('Error al eliminar la tarea');
            }
        }
    };

    return (
        <div className="min-h-screen bg-input-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Campo para ingresar la tarea */}
                <form onSubmit={handleAddTask} className="mb-8 space-y-4 flex flex-col sm:flex-col sm:items-center">
                    <input
                        type="text"
                        placeholder="Agregar nueva tarea"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg sm:flex-1"
                    />
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(Number(e.target.value))}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg sm:w-full"
                    >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="mt-4 sm:mt-0 sm:w-full bg-accent-secondary text-accent-secondary-dark p-2 rounded-md flex items-center gap-2 justify-center"
                    >
                        <MdAddCircle size={24} />
                        Agregar
                    </button>
                </form>

                {/* Grid responsiva para usuarios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="space-y-4">
                            <h3 className="text-lg font-semibold text-center">{user.name}</h3>
                            <div className="bg-bg-base shadow overflow-hidden rounded-3xl h-64 overflow-y-auto">
                                <ul className="divide-y divide-gray-200">
                                    {tasks
                                        .filter(task => task.userId === user.id)
                                        .map(task => (
                                            <li key={task.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                                        className="mr-3 flex-shrink-0"
                                                    >
                                                        {task.completed ? (
                                                            <MdCheckCircle className="h-6 w-6 text-accent-primary bg-accent-primary-dark rounded-full" />
                                                        ) : (
                                                            <MdCircle className="h-6 w-6 text-accent-muted" />
                                                        )}
                                                    </button>
                                                    <p className={`text-sm font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                                                        {task.text}
                                                    </p>
                                                </div>
                                                <span
                                                    className="text-xs text-gray-600 cursor-pointer"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                >
                                                    Eliminar
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tareas;
