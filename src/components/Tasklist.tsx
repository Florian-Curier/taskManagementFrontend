import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTaskCompleted, toggleSubTaskCompleted, addSubTask } from '../redux/taskSlice'; 
import { RootState, AppDispatch } from '../redux/store';
import TaskCard from './taskCard'; 
import '../styles/taskList.css';

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [taskDueDate, setTaskDueDate] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = () => {
        if (taskTitle.trim()) {
            const newTask = {
                _id: Date.now().toString(),
                title: taskTitle,
                description: taskDescription,
                completed: false,
                priority: taskPriority,
                dueDate: taskDueDate,
                UserId: '12345',
                subTasks: [], 
                category: '',
                id: '',
            };
            
            dispatch(addTask(newTask)).then(() => {
                setTaskTitle('');
                setTaskDescription('');
                setTaskPriority('medium');
                setTaskDueDate('');
            });
        }
    };

   const handleAddSubTask = (taskId: string, subTaskTitle: string) => {
    if (subTaskTitle.trim()) {
        dispatch(addSubTask({ taskId, subTaskTitle }));
    }
   }

    const handleToggleSubTaskComplete = (taskId: string, subTaskIndex: number) => {
        dispatch(toggleSubTaskCompleted({ taskId, subTaskIndex }));
      };

    const handleToggleCompleted = (taskId: string) => {
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
                onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="priority-select"
            >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <button onClick={handleAddTask} className="add-task-button">Add Task</button>

            {loading && <p>Loading tasks...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="task-grid">
                {tasks.map(task => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        onToggleComplete={handleToggleCompleted}
                        onAddSubTask={handleAddSubTask}
                        onToggleSubTaskComplete={handleToggleSubTaskComplete}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;