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
                            onChange={() => onToggleSubTaskComplete(task.id, index)}
                        />
                        {subTask.title}
                    </li>
                ))}
            </ul>

            <input
                type="text"
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                placeholder="Add sub-task"
            />
            <button onClick={() => {
                if (subTaskTitle.trim()) {
                    onAddSubTask(task._id, subTaskTitle);
                    setSubTaskTitle('');  // Clear the input after adding
                }
            }}>
                Add Sub-task
            </button>

            <button onClick={() => onToggleComplete(task._id ?? '')}>
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
        </div>
    );
};

export default TaskCard;