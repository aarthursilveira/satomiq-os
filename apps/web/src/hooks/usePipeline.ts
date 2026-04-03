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

export function usePipelineEntries(pipelineId: string) {
  return useQuery({
    queryKey: ["pipelines", pipelineId, "entries"],
    queryFn: () => pipelinesService.fetchPipelineEntries(pipelineId),
    enabled: Boolean(pipelineId),
    staleTime: 30_000,
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
    mutationFn: (body: { clientId: string; stageId: string; value?: number; notes?: string }) =>
      pipelinesService.createEntry(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipelines", pipelineId, "entries"] });
      toast.success("Cliente adicionado ao pipeline!");
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
