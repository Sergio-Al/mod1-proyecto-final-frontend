import { Task } from '../types';

const API_URL = 'http://localhost:3000';

export const tasksApi = {
  fetchTasks: async (): Promise<Task[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tareas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return response.json();
  },
  
  createTask: async (task: Task): Promise<Task> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tareas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    return response.json();
  },
  
  updateTask: async (task: Task): Promise<Task> => {
    if (!task.id) throw new Error('Task ID is required for updates');
    
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tareas/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return response.json();
  },
  
  deleteTask: async (taskId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    console.log(taskId)
    const response = await fetch(`${API_URL}/tareas/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
};
