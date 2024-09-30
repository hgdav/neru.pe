import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCircle, MdAddCircle } from 'react-icons/md';
import { getTasks, addTask, updateTask, deleteTask } from '../../utils/TareasApiFunctions';
import { toast } from 'react-toastify';

const Tareas = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

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
            };
            try {
                const addedTask = await addTask(task);
                if (addedTask) {
                    setTasks((prevTasks) => [...prevTasks, addedTask]);
                    setNewTask('');
                    toast.success('Observación, queja, sugerencia o propuesta agregada exitosamente');
                } else {
                    toast.error('Error al agregar la observación, queja, sugerencia o propuesta');
                }
            } catch (error) {
                console.error('Error en handleAddTask:', error);
                toast.error('Error al agregar la observación, queja, sugerencia o propuesta');
            }
        } else {
            toast.warn('El campo de observación, queja, sugerencia o propuesta no puede estar vacío');
        }
    };

    const toggleTaskCompletion = async (id, currentStatus) => {
        try {
            await updateTask(id, { completed: !currentStatus });
            setTasks(
                tasks.map(task => (task.id === id ? { ...task, completed: !currentStatus } : task))
            );
            toast.success('Observación, queja, sugerencia o propuesta actualizada exitosamente');
        } catch (error) {
            toast.error('Error al actualizar la observación, queja, sugerencia o propuesta');
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta observación, queja, sugerencia o propuesta?");
        if (confirmDelete) {
            try {
                await deleteTask(id);
                setTasks(tasks.filter(task => task.id !== id)); // Actualizar el estado eliminando la tarea
                toast.success('Observación, queja, sugerencia o propuesta eliminada');
            } catch (error) {
                toast.error('Error al eliminar la observación, queja, sugerencia o propuesta');
            }
        }
    };

    return (
        <div className="min-h-screen bg-input-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">

                {/* Campo para ingresar la tarea */}
                <form onSubmit={handleAddTask} className="mb-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Agregar observación o pendiente"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg"
                    />
                    <button
                        type="submit"
                        className="w-full bg-accent-primary text-accent-primary-dark p-2 rounded-md flex items-center gap-2 justify-center"
                    >
                        <MdAddCircle size={24} />
                        Agregar
                    </button>
                </form>

                {/* Lista de tareas */}
                <div className="bg-bg-base-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {tasks.map(task => (
                            <li key={task.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
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
                                    {/* Botón para eliminar tarea */}
                                    <span
                                        className="text-xs text-gray-600 cursor-pointer"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Eliminar
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Tareas;
