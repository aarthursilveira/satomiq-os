import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal.js";
import { Input } from "@/components/ui/Input.js";
import { Select } from "@/components/ui/Select.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Button } from "@/components/ui/Button.js";
import { useClients } from "@/hooks/useClients.js";
import { useUpdateTask } from "@/hooks/useTasks.js";
import { PRIORITY_LABELS, TASK_STATUS_LABELS } from "@satomiq/shared";

interface FormValues {
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
}

interface EditTaskModalProps {
  task: any | null;
  open: boolean;
  onClose: () => void;
}

export function EditTaskModal({ task, open, onClose }: EditTaskModalProps): JSX.Element {
  const updateTask = useUpdateTask(task?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    }
  }, [task, reset]);

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  async function handleFormSubmit(values: FormValues): Promise<void> {
    if (!task) return;

    const payload: any = {
      title: values.title,
      priority: values.priority,
      status: values.status,
      description: values.description || null,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };

    try {
      await updateTask.mutateAsync(payload);
      onClose();
    } catch (error) {
      // Error handled by mutation hook (toast)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Tarefa"
      description="Atualize os detalhes desta tarefa"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input
          label="Título *"
          placeholder="O que precisa ser feito?"
          error={errors.title?.message}
          {...register("title", { required: "Título é obrigatório" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Prioridade"
            options={priorityOptions}
            {...register("priority")}
          />
          <Input
            label="Data de Entrega"
            type="date"
            {...register("dueDate")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Status"
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
            loading={updateTask.isPending}
            className="flex-1"
          >
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
}
