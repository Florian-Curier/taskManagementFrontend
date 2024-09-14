
export interface Task {
    dueDate: string | null | undefined
    priority: "haute" | "moyenne" | "basse"
    category: string
    _id: string | null | undefined
    id: string 
    title: string
    description: string
    completed: boolean
}