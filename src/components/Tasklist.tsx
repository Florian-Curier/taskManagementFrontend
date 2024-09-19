import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTaskCompleted, toggleSubTaskCompleted, addSubTask, deleteTask } from '../redux/taskSlice'; 
import { RootState, AppDispatch } from '../redux/store';
import TaskCard from './taskCard'; 
import '../styles/taskList.css';

const TaskList: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskTime, setTasktime] = useState('')
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
                dueDate: taskDueDate ? `${taskDueDate}T${taskTime}`:'',//combiner date et heure
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
                setTasktime('')//Réinitialiser l'heure
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
    }
   
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const maxChars = 200; // Par exemple, limiter à 200 caractères
        if (e.target.value.length <= maxChars) {
            setTaskDescription(e.target.value);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask(taskId));
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
                onChange={handleDescriptionChange}
                placeholder="Add a description"
                className="description-input"
            />

            <div className="form-container">
            <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="due-date-input"
            />

<input
type="time"
value={taskTime}
onChange={(e) => setTasktime(e.target.value)}
className="time-input"
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
            </div>

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
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;