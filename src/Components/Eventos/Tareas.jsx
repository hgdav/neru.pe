import React, { useState, useEffect } from 'react';
import {
    getTasks,
    deleteTask,
    actualizarEstadoTarea as updateTaskStatus,
    crearTareaScrum as createTask
} from '../../utils/EventosApiFunctions';
import { toast } from 'react-toastify';
import { MdClose, MdAdd, MdChevronRight, MdChevronLeft, MdVisibility } from 'react-icons/md';
import { format } from 'date-fns';
import Modal from '../Modal';

const STATUSES = [
    { id: 'todo', title: 'Por Hacer', color: 'bg-blue-100 text-blue-800' },
    { id: 'inprogress', title: 'En Progreso', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'done', title: 'Terminado', color: 'bg-green-100 text-green-800' }
];

const USERS = [
    {
        id: 1,
        name: "Jean Pierre",
        color: { background: 'bg-blue-50', border: 'border-blue-200' }
    },
    {
        id: 2,
        name: "Alex",
        color: { background: 'bg-green-50', border: 'border-green-200' }
    },
    {
        id: 3,
        name: "Diana",
        color: { background: 'bg-pink-50', border: 'border-pink-200' }
    },
    {
        id: 4,
        name: "David",
        color: { background: 'bg-cyan-50', border: 'border-cyan-200' }
    }
];

const DEFAULT_COLOR = {
    background: 'bg-gray-50',
    border: 'border-gray-200'
};

const getUserColor = (userId) => {
    const user = USERS.find(u => u.id === userId);
    return user ? user.color : DEFAULT_COLOR;
};

const Tareas = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' });
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
    const [newStep, setNewStep] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const fetchedTasks = await getTasks();
            const validatedTasks = fetchedTasks.map(task => ({
                ...task,
                status: STATUSES.some(s => s.id === task.status) ? task.status : 'todo',
                steps: task.steps || []
            }));
            setTasks(validatedTasks);
        } catch (error) {
            toast.error('Error al cargar tareas');
        }
    };

    const handleMoveTask = async (task, newStatus) => {
        try {
            await updateTaskStatus(task.id, newStatus);
            setTasks(tasks.map(t =>
                t.id === task.id ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            toast.error('Error al mover la tarea');
            loadTasks();
        }
    };

    const getPreviousStatus = (currentStatus) => {
        const currentIndex = STATUSES.findIndex(s => s.id === currentStatus);
        return currentIndex > 0 ? STATUSES[currentIndex - 1]?.id : null;
    };

    const getNextStatus = (currentStatus) => {
        const currentIndex = STATUSES.findIndex(s => s.id === currentStatus);
        return currentIndex < STATUSES.length - 1 ? STATUSES[currentIndex + 1]?.id : null;
    };

    const removeTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
            toast.success('Tarea eliminada exitosamente');
        } catch (error) {
            toast.error('Error al eliminar la tarea');
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.assignee) {
            toast.error('Faltan campos requeridos');
            return;
        }

        try {
            await createTask({
                ...newTask,
                status: 'todo',
                date: new Date(),
                steps: []
            });
            await loadTasks();
            setShowModal(false);
            setNewTask({ title: '', description: '', assignee: '' });
        } catch (error) {
            toast.error('Error al crear tarea');
        }
    };

    const handleAddStep = () => {
        if (newStep.trim()) {
            const updatedTask = {
                ...selectedTask,
                steps: [...selectedTask.steps, { text: newStep.trim(), completed: false }]
            };

            setTasks(tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            ));
            setSelectedTask(updatedTask);
            setNewStep('');
        }
    };

    const handleStepToggle = (stepIndex) => {
        const updatedSteps = selectedTask.steps.map((step, index) =>
            index === stepIndex ? { ...step, completed: !step.completed } : step
        );

        const updatedTask = { ...selectedTask, steps: updatedSteps };
        setTasks(tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
        setSelectedTask(updatedTask);
    };

    return (
        <div className="min-h-screen bg-base-white py-8 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {STATUSES.map((status) => (
                        <div key={status.id} className="bg-pizarra rounded-lg shadow-sm p-4">
                            <div className={`${status.color} px-4 py-2 rounded-t-lg mb-4`}>
                                <h3 className="font-semibold">
                                    {status.title} ({tasks.filter(t => t.status === status.id).length})
                                </h3>
                            </div>

                            {status.id === 'todo' && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full mb-4 p-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-200 rounded-lg"
                                >
                                    <MdAdd size={18} /> Agregar Tarea
                                </button>
                            )}

                            <div className="space-y-2">
                                {tasks
                                    .filter(task => task.status === status.id)
                                    .map((task) => {
                                        const userColor = getUserColor(task.assignee);
                                        const user = USERS.find(u => u.id === task.assignee);

                                        return (
                                            <div
                                                key={task.id}
                                                className={`p-4 rounded-lg shadow-sm border ${userColor.background} ${userColor.border} transition-colors duration-200`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium mb-1">{task.title}</h4>
                                                        {task.description && (
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded ${userColor.background.replace('50', '100')} ${userColor.border.replace('200', '300')}`}>
                                                                {user?.name || 'Sin asignar'}
                                                            </span>
                                                            {task.date && (
                                                                <span>
                                                                    {format(
                                                                        task.date?.seconds
                                                                            ? new Date(task.date.seconds * 1000)
                                                                            : new Date(task.date),
                                                                        'dd MMM'
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTask(task);
                                                                    setShowTaskDetailsModal(true);
                                                                }}
                                                                className="text-gray-400 hover:text-blue-500"
                                                            >
                                                                <MdVisibility size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => removeTask(task.id)}
                                                                className="text-gray-400 hover:text-red-500"
                                                            >
                                                                <MdClose size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {getPreviousStatus(task.status) && (
                                                                <button
                                                                    onClick={() => handleMoveTask(task, getPreviousStatus(task.status))}
                                                                    className="text-black hover:text-blue-500"
                                                                >
                                                                    <MdChevronLeft size={20} />
                                                                </button>
                                                            )}
                                                            {getNextStatus(task.status) && (
                                                                <button
                                                                    onClick={() => handleMoveTask(task, getNextStatus(task.status))}
                                                                    className="text-black hover:text-green-500"
                                                                >
                                                                    <MdChevronRight size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal para crear nueva tarea */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Nueva Tarea</h3>
                            <input
                                type="text"
                                placeholder="Título de la tarea"
                                className="w-full p-2 mb-3 border rounded-md"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Descripción (opcional)"
                                className="w-full p-2 mb-3 border rounded-md"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <select
                                className="w-full p-2 mb-4 border rounded-md"
                                value={newTask.assignee}
                                onChange={(e) => setNewTask({ ...newTask, assignee: parseInt(e.target.value) })}
                            >
                                <option value="">Asignar a...</option>
                                {USERS.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    className="px-4 py-2 bg-accent-secondary text-accent-secondary-dark rounded-md"
                                >
                                    Crear Tarea
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para detalles de tarea */}
                <Modal
                    isOpen={showTaskDetailsModal}
                    onClose={() => {
                        setShowTaskDetailsModal(false);
                        setSelectedTask(null);
                    }}
                >
                    {selectedTask && (
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-4 text-xl text-center">Proceso del proyecto</h3>
                                <div className="space-y-3">
                                    {selectedTask.steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={step.completed}
                                                onChange={() => handleStepToggle(index)}
                                                className="w-5 h-5 text-accent-secondary rounded border-gray-300 focus:ring-accent-secondary"
                                            />
                                            <span className={`flex-1 ${step.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {step.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <input
                                        type="text"
                                        value={newStep}
                                        onChange={(e) => setNewStep(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                                        placeholder="Agregar nuevo paso"
                                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                    />
                                    <button
                                        onClick={handleAddStep}
                                        className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t pt-4">
                                <div>
                                    <p className="text-gray-500 mb-1">Asignado a:</p>
                                    <p className="font-medium">
                                        {USERS.find(u => u.id === selectedTask.assignee)?.name || 'No asignado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Fecha creación:</p>
                                    <p className="font-medium">
                                        {format(
                                            selectedTask.date?.seconds
                                                ? new Date(selectedTask.date.seconds * 1000)
                                                : new Date(selectedTask.date),
                                            'dd/MM/yyyy'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Tareas;