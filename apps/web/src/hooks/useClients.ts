import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientsService from "@/services/clients.service.js";
import { toast } from "@/components/feedback/Toast.js";

export function useClients(filters: clientsService.ClientFilters = {}) {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: () => clientsService.fetchClients(filters),
    staleTime: 30_000,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsService.fetchClientById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => clientsService.createClient(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar cliente."),
  });
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => clientsService.updateClient(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clients", id] });
      void qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar cliente."),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente arquivado.");
    },
    onError: () => toast.error("Erro ao arquivar cliente."),
  });
}

export function useClientNotes(clientId: string) {
  return useQuery({
    queryKey: ["clients", clientId, "notes"],
    queryFn: () => clientsService.fetchClientNotes(clientId),
    enabled: Boolean(clientId),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => clientsService.createNote(body),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ["clients", vars["clientId"], "notes"] });
      toast.success("Nota adicionada!");
    },
    onError: () => toast.error("Erro ao criar nota."),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) =>
      clientsService.deleteNote(id),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ["clients", vars.clientId, "notes"] });
      toast.success("Nota deletada.");
    },
  });
}

export function useClientActivities(clientId: string) {
  return useQuery({
    queryKey: ["clients", clientId, "activities"],
    queryFn: () => clientsService.fetchClientActivities(clientId),
    enabled: Boolean(clientId),
  });
}

export function useClientTasks(clientId: string) {
  return useQuery({
    queryKey: ["clients", clientId, "tasks"],
    queryFn: () => clientsService.fetchClientTasks(clientId),
    enabled: Boolean(clientId),
  });
}

export function useClientContacts(clientId: string) {
  return useQuery({
    queryKey: ["clients", clientId, "contacts"],
    queryFn: () => clientsService.fetchClientContacts(clientId),
    enabled: Boolean(clientId),
  });
}

export function useClientContent(clientId: string) {
  return useQuery({
    queryKey: ["clients", clientId, "content"],
    queryFn: () => clientsService.fetchClientContent(clientId),
    enabled: Boolean(clientId),
  });
}
