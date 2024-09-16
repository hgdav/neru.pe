import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCircle, MdAddCircle } from 'react-icons/md';
import { getTasks, addTask, updateTask, deleteTask } from '../../utils/TareasApiFunctions';
import { toast } from 'react-toastify';

const Tareas = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');

    useEffect(() => {
        // Cargar las tareas cuando el componente se monte
        const fetchTasks = async () => {
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks);
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask && taskDeadline) {
            const task = {
                text: newTask,
                deadline: taskDeadline,
                completed: false,
            };
            await addTask(task);
            setTasks([...tasks, task]); // Actualizar el estado local
            setNewTask('');
            setTaskDeadline('');
        }
    };

    const toggleTaskCompletion = async (id, currentStatus) => {
        await updateTask(id, { completed: !currentStatus });
        setTasks(
            tasks.map(task => (task.id === id ? { ...task, completed: !currentStatus } : task))
        );
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        if (confirmDelete) {
            await deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id)); // Eliminar tarea del estado local
            toast.success('Eliminado');
        }
    };

    const calculateTimeRemaining = (deadline) => {
        const now = new Date();
        const timeDifference = new Date(deadline) - now;

        if (timeDifference <= 0) {
            return 'Tiempo agotado';
        }

        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

        if (days > 0) {
            return `${days}d ${hours}h restantes`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m restantes`;
        } else {
            return `${minutes}m restantes`;
        }
    };

    return (
        <div className="min-h-screen bg-main py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">

                {/* Campo para ingresar la tarea */}
                <form onSubmit={handleAddTask} className="mb-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Agregar Evento"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="border border-accent-muted rounded-md p-2 w-full bg-input-bg"
                    />
                    <div className="flex flex-col sm:flex-row sm:gap-2 sm:space-x-2">
                        <input
                            type="datetime-local"
                            value={taskDeadline}
                            onChange={(e) => setTaskDeadline(e.target.value)}
                            className="w-full sm:w-1/2 border-accent-muted rounded px-3 py-2"
                        />
                        <button type="submit" className="w-full sm:w-1/2 bg-accent-primary text-white p-2 rounded-md flex items-center gap-2 justify-center">
                            <MdAddCircle size={24} />
                            Agregar
                        </button>
                    </div>

                </form>

                {/* Lista de tareas */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {tasks
                            .filter(task => task.deadline)
                            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))  // Ordenar por tiempo límite
                            .map(task => (
                                <li key={task.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                                className="mr-3 flex-shrink-0"
                                            >
                                                {task.completed ? (
                                                    <MdCheckCircle className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <MdCircle className="h-6 w-6 text-gray-400" />
                                                )}
                                            </button>
                                            <p className={`text-sm font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                                                {task.text}
                                            </p>
                                        </div>
                                        {/* Tiempo restante (click para eliminar la tarea) */}
                                        <span
                                            className="text-xs text-gray-600 cursor-pointer"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            {calculateTimeRemaining(task.deadline)}
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
