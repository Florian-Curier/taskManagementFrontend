import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask } from '../redux/taskSlice'; 
import { RootState, AppDispatch } from '../redux/store';
import TaskCard from './taskCard'; 
import DateTimePickerComponent from './dateTimePicker'; 
import moment, { Moment } from 'moment'; // Import de moment
import '../styles/taskList.css';
import { 
    toggleTaskCompleted, 
    addSubTask, 
    toggleSubTaskCompleted, 
    deleteTask 
  } from '../redux/taskSlice'; 
  import { auth } from '../firebase';

const TaskList: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDateTime, setTaskDueDateTime] = useState<Moment | null>(moment()); // Utilisation de Moment
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  const userId = auth.currentUser?.uid || 'guest'; // Récupération de l'ID de l'utilisateur connecté

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
        dueDate: taskDueDateTime ? taskDueDateTime.toISOString() : '', // Utilisation de moment pour la date
        UserId: userId, //Utilisation de l'ID dynamique 
        subTasks: [], 
      };

      dispatch(addTask(newTask)).then(() => {
        setTaskTitle('');
        setTaskDescription('');
        setTaskPriority('medium');
        setTaskDueDateTime(null); // Réinitialisation
      });
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
      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Add a description"
        className="description-input"
      />

      <div className="form-container">
        <DateTimePickerComponent
          value={taskDueDateTime}
          onChange={setTaskDueDateTime} // Mise à jour de l'état via Moment
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
            onToggleComplete={() => dispatch(toggleTaskCompleted(task._id))}
            onAddSubTask={(subTaskTitle) => dispatch(addSubTask({ taskId: task._id, subTaskTitle }))}
            onToggleSubTaskComplete={(taskId, subTaskIndex) => dispatch(toggleSubTaskCompleted({ taskId, subTaskIndex }))}
            onDelete={() => dispatch(deleteTask(task._id))}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;