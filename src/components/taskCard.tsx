import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import '../styles/taskCard.css';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onAddSubTask: (taskId: string, subTaskTitle: string) => void;
    onToggleSubTaskComplete: (taskId: string, subTaskIndex: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onAddSubTask, onToggleSubTaskComplete }) => {
    const [subTaskTitle, setSubTaskTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <div className={`task-card ${task.priority}-priority`}>
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>

            <h4>Sub-tasks:</h4>
            <ul>
                {task.subTasks?.map((subTask: SubTask, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={subTask.completed}
                            onChange={() => onToggleSubTaskComplete(task._id, index)}
                        />
                        {subTask.title}
                    </li>
                ))}
            </ul>

            <input
            className="add-subtask-input"
                type="text"
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                placeholder="Add sub-task"
            />
            <button  className="add-subtask-button"  onClick={() => {
    console.log('Task ID:', task._id);
    console.log('Sub-task title:', subTaskTitle);
    
    if (subTaskTitle.trim()) {
        onAddSubTask(task._id, subTaskTitle);
        setSubTaskTitle('');  // Efface l'input après ajout
        setError(null);
    } else {
        setError("Sub-task title cannot be empty");
    }
}}>
    Add Sub-task
</button>
{error && <p className="error-message">{error}</p>}

            <button onClick={() => onToggleComplete(task._id ?? '')}>
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
        </div>
    );
};

export default TaskCard;