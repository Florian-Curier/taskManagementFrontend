import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTaskCompleted } from '../redux/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import '../styles/taskList.css'

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
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
            description:"",
            completed: false,
            UserId: '12345'
        }
        dispatch(addTask(newTask))
           setTaskTitle('')
        } else {
            console.log('Title is required')
        }
    };

    const handleToggleCompleted = (taskId: string) => {
        console.log(`Mark task ${taskId} as completed`);
        dispatch(toggleTaskCompleted(taskId));
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
            <button onClick={handleAddTask} className="add-task-button">ADD Task</button>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id} className="task-item">
                        <span
                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                            onClick={() => {
                                console.log(`Tâche: ${task.title}, ID: ${task._id}`);
                                if (task._id) {
                                    handleToggleCompleted(task._id);
                                }
                            }}
                        >
                            {task.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;