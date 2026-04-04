import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal.js";
import { Input } from "@/components/ui/Input.js";
import { Select } from "@/components/ui/Select.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Button } from "@/components/ui/Button.js";
import { useCreateContent } from "@/hooks/useClients.js";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
}

interface FormValues {
  title: string;
  type: string;
  platform: string;
  description: string;
  scheduledAt: string;
}

export function AddContentModal({ open, onClose, clientId }: AddContentModalProps): JSX.Element {
  const createContent = useCreateContent(clientId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { type: "POST", platform: "instagram" },
  });

  async function handleFormSubmit(values: FormValues): Promise<void> {
    const payload: Record<string, unknown> = {
      title: values.title,
      type: values.type,
      platform: [values.platform],
      status: "IDEA",
    };
    if (values.description) payload["description"] = values.description;
    if (values.scheduledAt) payload["scheduledAt"] = new Date(values.scheduledAt).toISOString();

    await createContent.mutateAsync(payload);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Conteúdo" size="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input
          label="Título *"
          placeholder="Título do conteúdo"
          error={errors.title?.message}
          {...register("title", { required: "Título é obrigatório" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Tipo"
            options={[
              { value: "POST", label: "Post" },
              { value: "STORY", label: "Story" },
              { value: "REEL", label: "Reel" },
              { value: "CAROUSEL", label: "Carrossel" },
              { value: "VIDEO", label: "Vídeo" },
              { value: "BLOG", label: "Blog" },
              { value: "EMAIL_CAMPAIGN", label: "Email" },
            ]}
            {...register("type")}
          />
          <Select
            label="Plataforma"
            options={[
              { value: "instagram", label: "Instagram" },
              { value: "whatsapp", label: "WhatsApp" },
              { value: "blog", label: "Blog" },
              { value: "youtube", label: "YouTube" },
            ]}
            {...register("platform")}
          />
        </div>

        <Textarea label="Descrição" placeholder="Breve descrição do conteúdo..." rows={2} {...register("description")} />

        <Input
          label="Data de publicação"
          type="datetime-local"
          {...register("scheduledAt")}
        />

        <div className="flex gap-2 pt-1 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={() => { reset(); onClose(); }} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={createContent.isPending} className="flex-1">
            Criar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
