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
    priority: 'haute' | 'moyenne' | 'basse';
    dueDate: string | null;
    subTasks: SubTask[];
}