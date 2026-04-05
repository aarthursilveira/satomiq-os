import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal.js";
import { Input } from "@/components/ui/Input.js";
import { Select } from "@/components/ui/Select.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Button } from "@/components/ui/Button.js";
import { useClients } from "@/hooks/useClients.js";
import { useCreateTask } from "@/hooks/useTasks.js";
import { PRIORITY_LABELS, TASK_STATUS_LABELS } from "@satomiq/shared";

interface FormValues {
  title: string;
  description: string;
  clientId: string;
  priority: string;
  status: string;
  dueDate: string;
}

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ open, onClose }: CreateTaskModalProps): JSX.Element {
  const { data: clientsData, isLoading: isLoadingClients } = useClients({ limit: 100 });
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      priority: "MEDIUM",
      status: "TODO",
    },
  });

  const clients = (clientsData?.data as any[] | undefined) ?? [];
  const clientOptions = [
    { value: "", label: "Nenhum cliente" },
    ...clients.map((c) => ({ value: c.id, label: c.name })),
  ];

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  async function handleFormSubmit(values: FormValues): Promise<void> {
    const payload: any = {
      title: values.title,
      priority: values.priority,
      status: values.status,
    };

    if (values.description) payload.description = values.description;
    if (values.clientId) payload.clientId = values.clientId;
    if (values.dueDate) payload.dueDate = new Date(values.dueDate).toISOString();

    try {
      await createTask.mutateAsync(payload);
      reset();
      onClose();
    } catch (error) {
      // Error handled by mutation hook (toast)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova Tarefa"
      description="Crie uma nova tarefa para você ou para um cliente"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input
          label="Título *"
          placeholder="O que precisa ser feito?"
          error={errors.title?.message}
          {...register("title", { required: "Título é obrigatório" })}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Cliente"
            options={clientOptions}
            disabled={isLoadingClients}
            {...register("clientId")}
          />
          <Input
            label="Data de Entrega"
            type="date"
            {...register("dueDate")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Prioridade"
            options={priorityOptions}
            {...register("priority")}
          />
          <Select
            label="Status Inicial"
            options={statusOptions}
            {...register("status")}
          />
        </div>

        <Textarea
          label="Descrição"
          placeholder="Detalhes adicionais sobre a tarefa..."
          rows={3}
          {...register("description")}
        />

        <div className="flex gap-2 pt-2 border-t border-border-subtle mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createTask.isPending}
            className="flex-1"
          >
            Criar Tarefa
          </Button>
        </div>
      </form>
    </Modal>
  );
}
