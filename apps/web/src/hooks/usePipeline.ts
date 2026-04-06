import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as pipelinesService from "@/services/pipelines.service.js";
import { toast } from "@/components/feedback/Toast.js";

export function usePipelines() {
  return useQuery({
    queryKey: ["pipelines"],
    queryFn: pipelinesService.fetchPipelines,
    staleTime: 60_000,
  });
}

export function usePipelineById(pipelineId: string) {
  return useQuery({
    queryKey: ["pipelines", pipelineId],
    queryFn: () => pipelinesService.fetchPipelineById(pipelineId),
    enabled: Boolean(pipelineId),
    staleTime: 30_000,
  });
}

export function usePipelineEntries(pipelineId: string) {
  return useQuery({
    queryKey: ["pipelines", pipelineId, "entries"],
    queryFn: () => pipelinesService.fetchPipelineEntries(pipelineId),
    enabled: Boolean(pipelineId),
    staleTime: 30_000,
  });
}

export function useCreatePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; description?: string; color?: string }) =>
      pipelinesService.createPipeline(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar pipeline."),
  });
}

export function useUpdatePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; description?: string; color?: string }) =>
      pipelinesService.updatePipeline(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar pipeline."),
  });
}

export function useDeletePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pipelinesService.deletePipeline(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline removido.");
    },
    onError: () => toast.error("Erro ao remover pipeline."),
  });
}

export function useCreateStage(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; color: string; order?: number }) =>
      pipelinesService.createStage(pipelineId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId] });
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
      toast.success("Coluna adicionada!");
    },
    onError: () => toast.error("Erro ao criar coluna."),
  });
}

export function useUpdateStage(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ stageId, ...body }: { stageId: string; name?: string; color?: string; order?: number }) =>
      pipelinesService.updateStage(stageId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId] });
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
    },
    onError: () => toast.error("Erro ao atualizar coluna."),
  });
}

export function useDeleteStage(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stageId: string) => pipelinesService.deleteStage(stageId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId] });
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
      toast.success("Coluna removida.");
    },
    onError: () => toast.error("Erro ao remover coluna."),
  });
}

export function useMoveEntry(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, stageId }: { entryId: string; stageId: string }) =>
      pipelinesService.moveEntry(entryId, stageId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
    },
    onError: () => toast.error("Erro ao mover card."),
  });
}

export function useCreateEntry(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { clientId?: string; title?: string; stageId: string; value?: number; notes?: string; mediaUrls?: string[] }) =>
      pipelinesService.createEntry(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
      toast.success("Card adicionado ao pipeline!");
    },
    onError: () => toast.error("Erro ao adicionar ao pipeline."),
  });
}

export function useDeleteEntry(pipelineId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => pipelinesService.deleteEntry(entryId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
      toast.success("Removido do pipeline.");
    },
  });
}

export function useUploadFiles() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      if (files.length === 0) return [];
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      
      const { api } = await import("@/services/api.js");
      const { data } = await api.post<{ success: boolean; data: { urls: string[] } }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return data.data.urls;
    },
    onError: () => toast.error("Erro ao fazer upload da mídia."),
  });
}
