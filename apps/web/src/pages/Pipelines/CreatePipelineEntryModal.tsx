import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal.js";
import { Input } from "@/components/ui/Input.js";
import { Button } from "@/components/ui/Button.js";
import { Select } from "@/components/ui/Select.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { FileUp, X, Loader2 } from "lucide-react";
import { useCreateEntry, useUploadFiles } from "@/hooks/usePipeline.js";
import { fetchClients } from "@/services/clients.service.js";
import { toast } from "@/components/feedback/Toast.js";

interface CreatePipelineEntryModalProps {
  open: boolean;
  onClose: () => void;
  pipelineId: string;
  stageId: string;
}

export default function CreatePipelineEntryModal({
  open,
  onClose,
  pipelineId,
  stageId,
}: CreatePipelineEntryModalProps) {
  const createEntry = useCreateEntry(pipelineId);
  const uploadFiles = useUploadFiles();

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });
  
  const clients = (clientsData?.data as { id: string; name: string }[]) || [];
  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId && !title.trim()) {
      toast.error("Preencha o Título ou selecione um Cliente.");
      return;
    }

    try {
      let uploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadFiles.mutateAsync(selectedFiles);
      }

      await createEntry.mutateAsync({
        stageId,
        title: title.trim() || undefined,
        clientId: clientId || undefined,
        value: value ? Number(value) : undefined,
        notes: notes.trim() || undefined,
        mediaUrls: uploadedUrls,
      });

      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setTitle("");
    setClientId("");
    setValue("");
    setNotes("");
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Adicionar ao Funil" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-text-tertiary">
          Associe a um cliente de vendas, ou digite um título se for um projeto avulso.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Título do Card"
            placeholder="Ex: Reel de Final de Ano"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Cliente associado (opicional)"
            options={[{ value: "", label: "Nenhum cliente" }, ...clientOptions]}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>

        <Input
          label="Valor Estimado / Orçamento ($)"
          type="number"
          placeholder="Ex: 500.00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Textarea
          label="Observações / Link de briefing"
          placeholder="Anotações para este card..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-secondary">Anexos / Mídias</label>
          <div className="border border-dashed border-border-subtle hover:border-text-tertiary transition-colors bg-bg-tertiary/50 rounded-lg p-6 flex flex-col items-center justify-center relative cursor-pointer group">
            <input
              type="file"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <FileUp className="w-6 h-6 text-text-tertiary mb-2 group-hover:text-text-primary transition-colors" />
            <p className="text-sm font-medium text-text-primary">Clique ou arraste arquivos</p>
            <p className="text-xs text-text-tertiary mt-1">Imagens, vídeos suportados (Max 50MB)</p>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-bg-tertiary px-3 py-2 rounded border border-border-subtle">
                  <span className="text-xs text-text-secondary truncate max-w-[85%]">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-text-tertiary hover:text-status-error">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-border-subtle">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={createEntry.isPending || uploadFiles.isPending}
            disabled={!title && !clientId}
          >
            Adicionar Card
          </Button>
        </div>
      </form>
    </Modal>
  );
}
