import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTaskCompleted } from '../redux/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import '../styles/taskList.css';
import TaskCard from './taskCard';

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState(''); // Description remplace catégorie
    const [taskPriority, setTaskPriority] = useState<'haute' | 'moyenne' | 'basse'>('moyenne');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = () => {
        if (taskTitle.trim() && taskPriority) {
            const newTask = {
                _id: Date.now().toString(),
                id: Date.now().toString(),
                title: taskTitle,
                description: taskDescription,
                completed: false,
                priority: taskPriority,
                dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null, // Convertir la date correctement
                UserId: '12345', // Si pertinent
                category: '' // Add the category property
            };

            dispatch(addTask(newTask)).then(() => {
                setTaskTitle('');
                setTaskDescription('');
                setTaskPriority('moyenne');
                setTaskDueDate('');
                setConfirmationMessage('Task added successfully!');
                setTimeout(() => setConfirmationMessage(null), 3000);
            }).catch((error) => {
                setErrorMessage('Error adding task');
            });
        } else {
            setErrorMessage('Title and priority are required');
        }
    };

    const handleToggleCompleted = (taskId: string) => {
        dispatch(toggleTaskCompleted(taskId));
    };

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (task.description ? task.description.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );

    return (
        <div className="task-list-container">
            <h1>Task List</h1>

            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Add a task"
                className="task-input"
            />
            <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Add a description"
                className="description-input"
            />
            <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="due-date-input"
            />
            <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as 'haute' | 'moyenne' | 'basse')}
                className="priority-select"
            >
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
            </select>
            <button onClick={handleAddTask} className="add-task-button">Add Task</button>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks"
                className="search-input"
            />

            {loading && <p>Loading tasks...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="task-grid">
                {filteredTasks.map(task => (
                    <TaskCard key={task._id} task={task} onToggleComplete={handleToggleCompleted} />
                ))}
            </div>
        </div>
    );
};

export default TaskList;