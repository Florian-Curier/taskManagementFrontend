import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import '../styles/taskCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';  // Import pour utiliser dispatch
import { addSubTask } from '../redux/taskSlice';  // Import de l'action addSubTask

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onToggleSubTaskComplete: (taskId: string, subTaskIndex: number) => void;
    onDelete: (taskId: string) => void;
    onAddSubTask: (taskId: string, subTaskTitle: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onToggleSubTaskComplete, onDelete }) => {
    const [subTaskTitle, setSubTaskTitle] = useState('');  // État pour le titre de la sous-tâche
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();  // Utiliser dispatch pour envoyer l'action

    // Fonction pour gérer l'ajout d'une sous-tâche
    const handleAddSubTask = () => {
        if (subTaskTitle.trim()) {
            // Envoie la requête avec le titre de la sous-tâche
            console.log("TaskId:", task._id); // Debug
            console.log("SubTaskTitle:", subTaskTitle); // Debug
            dispatch(addSubTask({ taskId: task._id, subTaskTitle }));
            setSubTaskTitle('');  // Réinitialise l'input après ajout
            setError(null);  // Réinitialise l'erreur
        } else {
            console.error("Le titre de la sous-tâche est vide");
            setError("Le titre de la sous-tâche ne peut pas être vide");
        }
    };

    return (
        <div className={`task-card ${task.priority}-priority`}>
            <div className="task-card-header">
                <FontAwesomeIcon icon={faCircleXmark} className="cross-icon" onClick={() => onDelete(task._id)} />
            </div>
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>
                Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'} 
                {task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
            <button className="add-subtask-button" onClick={handleAddSubTask}>
                Add Sub-task
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TaskCard;