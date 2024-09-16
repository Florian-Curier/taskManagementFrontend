export interface SubTask {
    title: string;
    completed: boolean;
}

export interface Task {
    _id: string;
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    dueDate: string | null;
    subTasks: SubTask[];
}