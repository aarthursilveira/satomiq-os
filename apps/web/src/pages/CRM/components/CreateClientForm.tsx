import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input.js";
import { Select } from "@/components/ui/Select.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Button } from "@/components/ui/Button.js";

interface FormValues {
  name: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  website: string;
  description: string;
  contractValue: string;
  paymentDay: string;
}

interface CreateClientFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

export function CreateClientForm({ onSubmit, loading }: CreateClientFormProps): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { type: "PERSON", status: "ACTIVE" },
  });

  async function handleFormSubmit(values: FormValues): Promise<void> {
    const payload: Record<string, unknown> = {
      name: values.name,
      type: values.type,
      status: values.status,
    };
    if (values.email) payload["email"] = values.email;
    if (values.phone) payload["phone"] = values.phone;
    if (values.whatsapp) payload["whatsapp"] = values.whatsapp;
    if (values.instagram) payload["instagram"] = values.instagram;
    if (values.website) payload["website"] = values.website;
    if (values.description) payload["description"] = values.description;
    if (values.contractValue) payload["contractValue"] = parseFloat(values.contractValue);
    if (values.paymentDay) payload["paymentDay"] = parseInt(values.paymentDay, 10);
    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome *"
        placeholder="Nome do cliente ou empresa"
        error={errors.name?.message}
        {...register("name", { required: "Nome é obrigatório" })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Tipo"
          options={[
            { value: "PERSON", label: "Pessoa Física" },
            { value: "BRAND", label: "Marca" },
            { value: "COMPANY", label: "Empresa" },
          ]}
          {...register("type")}
        />
        <Select
          label="Status"
          options={[
            { value: "LEAD", label: "Lead" },
            { value: "PROSPECT", label: "Prospect" },
            { value: "ACTIVE", label: "Ativo" },
            { value: "PAUSED", label: "Pausado" },
          ]}
          {...register("status")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" type="email" placeholder="email@exemplo.com" {...register("email")} />
        <Input label="Telefone" placeholder="+55 11 99999-9999" {...register("phone")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="WhatsApp" placeholder="+55 11 99999-9999" {...register("whatsapp")} />
        <Input label="Instagram" placeholder="@usuario" {...register("instagram")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Valor do Contrato (R$)" type="number" step="0.01" placeholder="0.00" {...register("contractValue")} />
        <Input label="Dia de Pagamento" type="number" min="1" max="31" placeholder="15" {...register("paymentDay")} />
      </div>

      <Textarea label="Descrição" placeholder="Breve descrição do cliente..." rows={2} {...register("description")} />

      <div className="flex gap-2 pt-1 border-t border-border-subtle">
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          Criar Cliente
        </Button>
      </div>
    </form>
  );
}
