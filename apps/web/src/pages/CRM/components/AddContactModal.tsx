import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal.js";
import { Input } from "@/components/ui/Input.js";
import { Button } from "@/components/ui/Button.js";
import { useCreateContact } from "@/hooks/useClients.js";

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
}

interface FormValues {
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export function AddContactModal({ open, onClose, clientId }: AddContactModalProps): JSX.Element {
  const createContact = useCreateContact(clientId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  async function handleFormSubmit(values: FormValues): Promise<void> {
    const payload: Record<string, unknown> = { name: values.name };
    if (values.role) payload["role"] = values.role;
    if (values.email) payload["email"] = values.email;
    if (values.phone) payload["phone"] = values.phone;
    if (values.whatsapp) payload["whatsapp"] = values.whatsapp;

    await createContact.mutateAsync(payload);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar Contato" size="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome *"
          placeholder="Nome do contato"
          error={errors.name?.message}
          {...register("name", { required: "Nome é obrigatório" })}
        />
        <Input label="Cargo / Função" placeholder="Proprietário, Gerente..." {...register("role")} />
        <Input label="Email" type="email" placeholder="email@exemplo.com" {...register("email")} />
        <Input label="Telefone" placeholder="+55 11 99999-9999" {...register("phone")} />
        <Input label="WhatsApp" placeholder="+55 11 99999-9999" {...register("whatsapp")} />

        <div className="flex gap-2 pt-1 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={() => { reset(); onClose(); }} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={createContact.isPending} className="flex-1">
            Adicionar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
