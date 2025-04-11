import { Task } from '../types';
import { env } from '../../../shared/config/env';

const API_URL = env.API_URL;

export const tasksApi = {
  fetchTasks: async ({ search, status }: { search?: string | null, status?: string | null }): Promise<Task[]> => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      search: search || '',
      status: status || '',
    });
    
    const response = await fetch(`${API_URL}/tareas?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET"
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
