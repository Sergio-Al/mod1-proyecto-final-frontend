import { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasksApi';
import { Task } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (task: Task) => {
    try {
      const newTask = await tasksApi.createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
      return null;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await tasksApi.updateTask(task);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      setSelectedTask(null);
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      return null;
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      return true;
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      return false;
    }
  };

  const selectTask = (task: Task | null) => {
    setSelectedTask(task);
  };

  return {
    tasks,
    selectedTask,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    selectTask
  };
};
