import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../types';

// Définir les actions asynchrones
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            const errorText = await response.text();
            return rejectWithValue(`Error fetching tasks: ${errorText}`);
        }
        return (await response.json()) as Task[];
    } catch (error: unknown) {
        return rejectWithValue(`Error fetching tasks: ${(error as Error).message}`);
    }
});

export const addTask = createAsyncThunk('tasks/addTask', async (newTask: Task, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return rejectWithValue(`Error adding task: ${errorText}`);
        }
        return (await response.json()) as Task;
    } catch (error) {
        return rejectWithValue(`Error adding task: ${(error as Error).message}`);
    }
});

export const addSubTask = createAsyncThunk<
    Task, // Type du résultat de l'action (par exemple, une tâche mise à jour)
    { taskId: string; subTaskTitle: string }, // Les arguments de l'action
    { rejectValue: string } // Type des erreurs
>(
    'tasks/addSubTask',
    async ({ taskId, subTaskTitle }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/subtask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: subTaskTitle }),
            });
            if (!response.ok) {
                return rejectWithValue('Erreur lors de l\'ajout de la sous-tâche');
            }
            return (await response.json()) as Task;
        } catch (error) {
            return rejectWithValue('Erreur réseau lors de l\'ajout de la sous-tâche');
        }
    }
);

// Nouvelle action asynchrone pour mettre à jour une tâche
export const updateTask = createAsyncThunk('tasks/updateTask', async (updatedTask: Task, { rejectWithValue }) => {
    try {
        const response = await fetch(`/api/tasks/${updatedTask._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return rejectWithValue(`Error updating task: ${errorText}`);
        }
        return (await response.json()) as Task;
    } catch (error) {
        return rejectWithValue(`Error updating task: ${(error as Error).message}`);
    }
});

// Nouvelle action asynchrone pour supprimer une tâche
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string, { rejectWithValue }) => {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            return rejectWithValue(`Error deleting task: ${errorText}`);
        }
        return taskId;
    } catch (error) {
        return rejectWithValue(`Error deleting task: ${(error as Error).message}`);
    }
});

// Nouvelle action asynchrone pour mettre à jour l'état de la tâche
export const toggleTaskCompleted = createAsyncThunk('tasks/toggleTaskCompleted', async (taskId: string, { rejectWithValue }) => {
    console.log(`Toggling task with ID: ${taskId}`)
    if (!taskId) {
        throw new Error("task ID is undefined")
    }
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            return rejectWithValue(`Error toggling task: ${errorText}`);
        }
        return (await response.json()) as Task;
    } catch (error) {
        return rejectWithValue(`Error toggling task: ${(error as Error).message}`);
    }
});

 // Implémentation de la logique pour basculer l'état de la sous-tâche.
 export const toggleSubTaskCompleted = createAsyncThunk(
    'tasks/toggleSubTaskCompleted',
    async ({ taskId, subTaskIndex }: { taskId: string; subTaskIndex: number }, { rejectWithValue }) => {
        if (!taskId || typeof subTaskIndex !== 'number') {
            console.error("Invalid taskId or subTaskIndex", { taskId, subTaskIndex });
            return rejectWithValue("TaskId or subTaskIndex undefined");
        }
        try {
            const response = await fetch(`/api/tasks/${taskId}/subtasks/${subTaskIndex}/toggle`, {
                method: 'PATCH',
            });

            // Log the response to debug the server response
            const data = await response.json();
            console.log('Response from server:', data);

            if (!response.ok) {
                return rejectWithValue(`Error toggling sub-task: ${data.message || "Unknown error"}`);
            }

            return data as Task;
        } catch (error) {
            return rejectWithValue(`Error toggling sub-task: ${(error as Error).message}`);
        }
    }
);


// Définir le type pour l'état initial
interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

// Définir l'état initial
const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

// Créer le slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            state.tasks.push(action.payload);
        });
        builder.addCase(addTask.rejected, (state, action) => {
            state.error = action.payload as string;
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        });
        builder.addCase(updateTask.rejected, (state, action) => {
            state.error = action.payload as string;
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
        });
        builder.addCase(deleteTask.rejected, (state, action) => {
            state.error = action.payload as string;
        });
        builder.addCase(toggleTaskCompleted.fulfilled, (state, action) => {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        });
        builder.addCase(toggleTaskCompleted.rejected, (state, action) => {
            state.error = action.payload as string;
        });
        builder.addCase(addSubTask.fulfilled, (state, action) => {
            const updatedTask = action.payload;
            console.log('Updated task after sub-task addition:', updatedTask);  // Affiche la tâche mise à jour avec les sous-tâches
        
            const taskIndex = state.tasks.findIndex(task => task._id === updatedTask._id);
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = updatedTask;  // Mets à jour la tâche dans le state Redux
            }
        });
        builder.addCase(toggleSubTaskCompleted.fulfilled, (state, action) => {
            console.log('Payload:', action.payload); 
            
            const updatedTask = action.payload;
            console.log('Updated Task ID:', updatedTask?._id); 
        
            const taskIndex = state.tasks.findIndex(task => task._id === updatedTask._id);
        
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = updatedTask;
            }
        });
    },
});

export default taskSlice.reducer;