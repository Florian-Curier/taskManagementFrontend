import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTaskCompleted, deleteTask, updateTask } from '../redux/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Task } from '../types';
import '../styles/taskList.css';

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskCategory, setTaskCategory] = useState('');
    const [taskPriority, setTaskPriority] = useState<'haute' | 'moyenne' | 'basse'>('moyenne');
    const [taskDueDate, setTaskDueDate] = useState(''); // Date d'échéance optionnelle
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector((state: RootState) => {
        console.log(state.tasks); 
        return state.tasks;
    });

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = () => {
        if (taskTitle.trim() && taskCategory.trim() && taskPriority) {
            const newTask = {
                _id: Date.now().toString(),
                id: Date.now().toString(),
                title: taskTitle,
                description: "",
                completed: false,
                category: taskCategory,
                priority: taskPriority,
                dueDate: taskDueDate || null, // Date d'échéance optionnelle
                UserId: '12345',
            };
            dispatch(addTask(newTask)).then(() => {
                setTaskTitle('');
                setTaskCategory('');
                setTaskPriority('moyenne');
                setTaskDueDate(''); // Réinitialise la date d'échéance
                setErrorMessage(null);
            }).catch((error) => {
                setErrorMessage('Error adding task');
                console.error(error);
            });
        } else {
            setErrorMessage('Title, category, and priority are required');
        }
    };

    const handleToggleCompleted = (taskId: string) => {
        dispatch(toggleTaskCompleted(taskId));
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask(taskId)).then(() => {
            setConfirmationMessage('Task deleted successfully');
            setTimeout(() => setConfirmationMessage(null), 3000); // Clear message after 3 seconds
        });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setTaskTitle(task.title);
        setTaskCategory(task.category);
        setTaskPriority(task.priority as 'haute' | 'moyenne' | 'basse');
        setTaskDueDate(task.dueDate || ''); // Charger la date d'échéance lors de l'édition
    };

    const handleUpdateTask = () => {
        if (editingTask && taskTitle.trim() && taskCategory.trim() && taskPriority) {
            const updatedTask = { ...editingTask, title: taskTitle, category: taskCategory, priority: taskPriority, dueDate: taskDueDate || null };
            dispatch(updateTask(updatedTask)).then(() => {
                setEditingTask(null);
                setTaskTitle('');
                setTaskCategory('');
                setTaskPriority('moyenne');
                setTaskDueDate('');
                setConfirmationMessage('Task updated successfully');
                setTimeout(() => setConfirmationMessage(null), 3000);
            });
        } else {
            setErrorMessage('Title, category, and priority are required');
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory ? task.category === filterCategory : true)
    );

    return (
        <div className="task-list-container">
            <h1>Task List</h1>
            <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Add a task"
                className="task-input"
            />
            <input
                type="text"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                placeholder="Add a category"
                className="category-input"
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
            <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                placeholder="Add a due date"
                className="due-date-input"
            />
            <button onClick={editingTask ? handleUpdateTask : handleAddTask} className="add-task-button">
                {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks"
                className="search-input"
            />
            <input
                type="text"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                placeholder="Filter by category"
                className="filter-input"
            />
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <ul className="task-list">
                {filteredTasks.map(task => (
                    <li key={task._id} className="task-list-item">
                        <span
                            className={`task-title ${task.completed ? 'completed' : ''}`}
                            onClick={() => handleToggleCompleted(task._id ?? '')}
                        >
                            {task.title} - {task.category || 'No category'} - {task.priority} - Due: {task.dueDate ? task.dueDate : 'No due date'}
                        </span>
                        <button className="edit-button" onClick={() => handleEditTask(task)}>
                            <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteTask(task._id ?? '')}>
                            <i className="fas fa-trash-alt"></i> Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;