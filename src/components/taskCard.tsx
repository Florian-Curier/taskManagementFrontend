import React from 'react';
import { Task } from '../types';
import '../styles/taskCard.css';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete }) => {
    // Détermine la classe CSS en fonction de la priorité
    const priorityClass = task.priority === 'haute'
        ? 'high-priority'
        : task.priority === 'moyenne'
        ? 'medium-priority'
        : 'low-priority';

    return (
        <div className={`task-card ${priorityClass}`} onClick={() => onToggleComplete(task._id ?? '')}>
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        </div>
    );
};

export default TaskCard;