/**
 * Tasks Service
 * Handles all task-related API calls
 */

import apiClient from '../config/api.config';

export interface Task {
  id: string;
  title: string;
  type: string;
  assignedTo: string;
  assignedToId?: string;
  status: string;
  priority: string;
  dueDate: string | null;
  location: string | null;
  zone: string | null;
  description: string | null;
  createdAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  pendingTasks: number;
  inProgressTasks: number;
  completedToday: number;
}

export interface CreateTaskRequest {
  title: string;
  type: string;
  assignedToUserId: string;
  assignedToName: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  barrelId?: string;
  zone?: string;
  cameraZone?: string;
  location?: string;
  description?: string;
  createdByUserId?: string;
}

class TasksService {
  /**
   * Get all tasks
   */
  async getAll(): Promise<TasksResponse> {
    const response = await apiClient.get<TasksResponse>('/tasks');
    return response.data;
  }

  /**
   * Get tasks for a specific user
   */
  async getByUser(userId: string): Promise<Task[]> {
    const response = await apiClient.get<Task[]>(`/tasks/user/${userId}`);
    return response.data;
  }

  /**
   * Create a new task
   */
  async create(taskData: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', taskData);
    return response.data;
  }
}

export const tasksService = new TasksService();

