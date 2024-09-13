import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  { fetchTasks, addTask, toggleTaskCompleted, deleteTask, updateTask } from '../redux/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Task } from '../types'; // 
import '../styles/taskList.css';

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = () => {
        if (taskTitle.trim()) {
            const newTask = {
                _id: Date.now().toString(),
                id: Date.now().toString(),
                title: taskTitle,
                description: "",
                completed: false,
                UserId: '12345'
            };
            dispatch(addTask(newTask));
            setTaskTitle('');
        } else {
            console.log('Title is required');
        }
    };

    const handleToggleCompleted = (taskId: string) => {
        console.log(`Mark task ${taskId} as completed`);
        dispatch(toggleTaskCompleted(taskId));
    };

    const handleDeleteTask = (taskId: string) => {
        console.log(`Delete task ${taskId}`);
        dispatch(deleteTask(taskId)).then(() => {
            setConfirmationMessage('Task deleted successfully');
            setTimeout(() => setConfirmationMessage(null), 3000); // Clear message after 3 seconds
        });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setTaskTitle(task.title);
    };

    const handleUpdateTask = () => {
        if (editingTask && taskTitle.trim()) {
            const updatedTask = { ...editingTask, title: taskTitle };
            dispatch(updateTask(updatedTask)).then(() => {
                setEditingTask(null);
                setTaskTitle('');
                setConfirmationMessage('Task updated successfully');
                setTimeout(() => setConfirmationMessage(null), 3000); // Clear message after 3 seconds
            });
        } else {
            console.log('Title is required');
        }
    };

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
            <button onClick={editingTask ? handleUpdateTask : handleAddTask} className="add-task-button">
                {editingTask ? 'Update Task' : 'Add Task'}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}

            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id} className="task-list-item">
                        <span
                            className={`task-title ${task.completed ? 'completed' : ''}`}
                            onClick={() => {
                                console.log(`Tâche: ${task.title}, ID: ${task._id}`);
                                if (task._id) {
                                    handleToggleCompleted(task._id);
                                }
                            }}
                        >
                            {task.title}
                        </span>
                        <button className="edit-button" onClick={() => handleEditTask(task)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDeleteTask(task._id ?? '')}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;