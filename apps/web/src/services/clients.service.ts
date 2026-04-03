import api from "@/services/api.js";
import type { ApiResponse } from "@satomiq/shared";

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export async function fetchClients(filters: ClientFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== "") params.set(key, String(val));
  });
  const { data } = await api.get<ApiResponse<unknown[]>>(`/clients?${params}`);
  return data;
}

export async function fetchClientById(id: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/clients/${id}`);
  return data.data;
}

export async function createClient(body: Record<string, unknown>) {
  const { data } = await api.post<ApiResponse<unknown>>("/clients", body);
  return data.data;
}

export async function updateClient(id: string, body: Record<string, unknown>) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/clients/${id}`, body);
  return data.data;
}

export async function deleteClient(id: string) {
  const { data } = await api.delete<ApiResponse<unknown>>(`/clients/${id}`);
  return data;
}

export async function fetchClientNotes(clientId: string, params: Record<string, unknown> = {}) {
  const qs = new URLSearchParams({ clientId, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const { data } = await api.get<ApiResponse<unknown[]>>(`/notes?${qs}`);
  return data;
}

export async function createNote(body: Record<string, unknown>) {
  const { data } = await api.post<ApiResponse<unknown>>("/notes", body);
  return data.data;
}

export async function updateNote(id: string, body: Record<string, unknown>) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/notes/${id}`, body);
  return data.data;
}

export async function deleteNote(id: string) {
  await api.delete(`/notes/${id}`);
}

export async function fetchClientActivities(clientId: string) {
  const { data } = await api.get<ApiResponse<unknown[]>>(`/activities?clientId=${clientId}`);
  return data;
}

export async function fetchClientTasks(clientId: string, params: Record<string, unknown> = {}) {
  const qs = new URLSearchParams({ clientId, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const { data } = await api.get<ApiResponse<unknown[]>>(`/tasks?${qs}`);
  return data;
}

export async function fetchClientContacts(clientId: string) {
  const { data } = await api.get<ApiResponse<unknown[]>>(`/clients/${clientId}/contacts`);
  return data.data;
}

export async function createContact(clientId: string, body: Record<string, unknown>) {
  const { data } = await api.post<ApiResponse<unknown>>(`/clients/${clientId}/contacts`, body);
  return data.data;
}

export async function fetchClientContent(clientId: string, params: Record<string, unknown> = {}) {
  const qs = new URLSearchParams({ clientId, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const { data } = await api.get<ApiResponse<unknown[]>>(`/content?${qs}`);
  return data;
}
