import api from "@/services/api.js";
import type { ApiResponse } from "@satomiq/shared";

export async function fetchPipelines() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/pipelines");
  return data.data;
}

export async function fetchPipelineEntries(pipelineId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/pipelines/${pipelineId}/entries`);
  return data.data;
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
