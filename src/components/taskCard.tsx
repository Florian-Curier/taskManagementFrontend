import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import '../styles/taskCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onAddSubTask: (taskId: string, subTaskTitle: string) => void;
    onToggleSubTaskComplete: (taskId: string, subTaskIndex: number) => void;
    onDelete: (taskId: string) => void; // Ajout de la prop onDelete
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onAddSubTask, onToggleSubTaskComplete, onDelete }) => {
    const [subTaskTitle, setSubTaskTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <div className={`task-card ${task.priority}-priority`}>
            <div className="task-card-header">
                {/* Ajout de l'événement onClick pour supprimer la tâche */}
                <FontAwesomeIcon icon={faCircleXmark} className="cross-icon" onClick={() => onDelete(task._id)} />
            </div>
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>
            Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'} {task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>

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
            <button
                className="add-subtask-button"
                onClick={() => {
                    if (subTaskTitle.trim()) {
                        onAddSubTask(task._id, subTaskTitle);
                        setSubTaskTitle(''); // Efface l'input après ajout
                        setError(null);
                    } else {
                        setError("Sub-task title cannot be empty");
                    }
                }}
            >
                Add Sub-task
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TaskCard;