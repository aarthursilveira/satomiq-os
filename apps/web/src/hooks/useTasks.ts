import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tasksService from "@/services/tasks.service.js";
import { toast } from "@/components/feedback/Toast.js";

export function useTasks(filters: tasksService.TaskFilters = {}) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => tasksService.fetchTasks(filters),
    staleTime: 30_000,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: tasksService.CreateTaskInput) => tasksService.createTask(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!");
    },
    onError: () => toast.error("Erro ao criar tarefa."),
  });
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: tasksService.UpdateTaskInput) => tasksService.updateTask(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar tarefa."),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa removida.");
    },
    onError: () => toast.error("Erro ao remover tarefa."),
  });
}
