import api from "@/services/api.js";
import type { ApiResponse } from "@satomiq/shared";

export async function fetchPipelines() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/pipelines");
  return data.data;
}

export async function fetchPipelineById(pipelineId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/pipelines/${pipelineId}`);
  return data.data;
}

export async function fetchPipelineEntries(pipelineId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/pipelines/${pipelineId}/entries`);
  return data.data;
}

export async function createPipeline(body: { name: string; description?: string; color?: string }) {
  const { data } = await api.post<ApiResponse<unknown>>("/pipelines", body);
  return data.data;
}

export async function updatePipeline(
  id: string,
  body: { name?: string; description?: string; color?: string },
) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/pipelines/${id}`, body);
  return data.data;
}

export async function deletePipeline(id: string) {
  await api.delete(`/pipelines/${id}`);
}

export async function createStage(
  pipelineId: string,
  body: { name: string; color: string; order?: number },
) {
  const { data } = await api.post<ApiResponse<unknown>>(`/pipelines/${pipelineId}/stages`, body);
  return data.data;
}

export async function updateStage(
  stageId: string,
  body: { name?: string; color?: string; order?: number },
) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/pipelines/stages/${stageId}`, body);
  return data.data;
}

export async function deleteStage(stageId: string) {
  await api.delete(`/pipelines/stages/${stageId}`);
}

export async function moveEntry(entryId: string, stageId: string) {
  const { data } = await api.patch<ApiResponse<unknown>>(
    `/pipelines/entries/${entryId}/move`,
    { stageId },
  );
  return data.data;
}

export async function createEntry(body: { clientId: string; stageId: string; value?: number; notes?: string }) {
  const { data } = await api.post<ApiResponse<unknown>>("/pipelines/entries", body);
  return data.data;
}

export async function deleteEntry(entryId: string) {
  await api.delete(`/pipelines/entries/${entryId}`);
}
