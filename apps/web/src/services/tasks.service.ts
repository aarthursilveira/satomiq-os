import api from "@/services/api.js";
import type { ApiResponse } from "@satomiq/shared";

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  clientId?: string;
  projectId?: string;
  assigneeId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  clientId?: string;
  projectId?: string;
  assigneeId?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export async function fetchTasks(filters: TaskFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== "") params.set(key, String(val));
  });
  const { data } = await api.get<ApiResponse<unknown[]>>(`/tasks?${params}`);
  return data;
}

export async function createTask(body: CreateTaskInput) {
  const { data } = await api.post<ApiResponse<unknown>>("/tasks", body);
  return data.data;
}

export async function updateTask(id: string, body: UpdateTaskInput) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/tasks/${id}`, body);
  return data.data;
}

export async function deleteTask(id: string) {
  const { data } = await api.delete<ApiResponse<unknown>>(`/tasks/${id}`);
  return data;
}
