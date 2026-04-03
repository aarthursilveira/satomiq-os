import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  Users,
} from "lucide-react";
import { useClients, useCreateClient } from "@/hooks/useClients.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { Select } from "@/components/ui/Select.js";
import { Modal } from "@/components/ui/Modal.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonCard, SkeletonRow } from "@/components/feedback/Skeleton.js";
import { formatCurrency, formatRelativeTime, CLIENT_STATUS_LABELS, CLIENT_TYPE_LABELS } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";
import { CreateClientForm } from "@/pages/CRM/components/CreateClientForm.js";

type ViewMode = "grid" | "list";

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "LEAD", label: "Lead" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "PAUSED", label: "Pausado" },
  { value: "CHURNED", label: "Churned" },
  { value: "ARCHIVED", label: "Arquivado" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "PERSON", label: "Pessoa Física" },
  { value: "BRAND", label: "Marca" },
  { value: "COMPANY", label: "Empresa" },
];

interface ClientRecord {
  id: string;
  name: string;
  type: string;
  slug: string;
  status: string;
  avatarUrl: string | null;
  email: string | null;
  contractValue: number | null;
  tags: string[];
  updatedAt: string;
  _count?: {
    tasks: number;
    notes: number;
    contacts: number;
  };
}

function ClientGridCard({ client, onClick }: { client: ClientRecord; onClick: () => void }): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="card p-5 cursor-pointer hover:border-border-default hover:shadow-elevated transition-all duration-200 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={client.name} src={client.avatarUrl} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-hover transition-colors">
            {client.name}
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            {CLIENT_TYPE_LABELS[client.type] ?? client.type}
          </p>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {client.email && (
        <p className="text-xs text-text-tertiary truncate mb-2">{client.email}</p>
      )}

      {client.contractValue != null && (
        <p className="text-sm font-semibold text-text-primary mb-3">
          {formatCurrency(Number(client.contractValue))}
          <span className="text-xs font-normal text-text-tertiary">/mês</span>
        </p>
      )}

      {client.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {client.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary border border-border-subtle rounded text-text-tertiary"
            >
              {tag}
            </span>
          ))}
          {client.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-text-tertiary">
              +{client.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-text-tertiary border-t border-border-subtle pt-3 mt-3">
        {client._count && (
          <>
            <span>{client._count.tasks} tarefas</span>
            <span>·</span>
            <span>{client._count.notes} notas</span>
          </>
        )}
        <span className="ml-auto">{formatRelativeTime(client.updatedAt)}</span>
      </div>
    </motion.div>
  );
}

function ClientListRow({ client, onClick }: { client: ClientRecord; onClick: () => void }): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle last:border-0 cursor-pointer hover:bg-bg-tertiary/50 transition-colors group"
    >
      <Avatar name={client.name} src={client.avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-hover transition-colors">
          {client.name}
        </p>
        <p className="text-xs text-text-tertiary">{client.email ?? "—"}</p>
      </div>
      <span className="text-xs text-text-tertiary hidden sm:block">
        {CLIENT_TYPE_LABELS[client.type] ?? client.type}
      </span>
      <StatusBadge status={client.status} />
      {client.contractValue != null && (
        <span className="text-sm font-semibold text-text-primary hidden md:block w-28 text-right">
          {formatCurrency(Number(client.contractValue))}
        </span>
      )}
      <span className="text-xs text-text-tertiary hidden lg:block w-24 text-right">
        {formatRelativeTime(client.updatedAt)}
      </span>
    </motion.div>
  );
}

export default function ClientListPage(): JSX.Element {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useClients({
    search: search || undefined,
    status: status || undefined,
    type: type || undefined,
    page,
    limit: 20,
  });

  const createClient = useCreateClient();

  const clients = (data?.data as ClientRecord[] | undefined) ?? [];
  const meta = data?.meta;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-text-primary font-display tracking-tight">
            Clientes
          </h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            {meta?.total != null ? `${meta.total} clientes no total` : "Gerenciar sua base de clientes"}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setCreateOpen(true)}
        >
          Novo Cliente
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap items-center gap-3 mb-5"
      >
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftElement={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="w-40"
          placeholder=""
        />

        <Select
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="w-36"
          placeholder=""
        />

        <div className="ml-auto flex items-center bg-bg-tertiary border border-border-default rounded p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === "grid"
                ? "bg-bg-elevated text-text-primary shadow-subtle"
                : "text-text-tertiary hover:text-text-primary",
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === "list"
                ? "bg-bg-elevated text-text-primary shadow-subtle"
                : "text-text-tertiary hover:text-text-primary",
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="card overflow-hidden">
            {Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)}
          </div>
        )
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users className="w-5 h-5" />}
          title="Nenhum cliente encontrado"
          description={search || status || type ? "Tente ajustar os filtros." : "Crie seu primeiro cliente para começar."}
          action={
            !search && !status && !type ? (
              <Button variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>
                Criar primeiro cliente
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ClientGridCard
                client={client}
                onClick={() => navigate(`/crm/${client.id}`)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-bg-tertiary/50 border-b border-border-subtle">
            <div className="w-8" />
            <span className="flex-1 text-xs font-medium text-text-tertiary">Nome</span>
            <span className="text-xs font-medium text-text-tertiary hidden sm:block w-24">Tipo</span>
            <span className="text-xs font-medium text-text-tertiary w-20">Status</span>
            <span className="text-xs font-medium text-text-tertiary hidden md:block w-28 text-right">Contrato</span>
            <span className="text-xs font-medium text-text-tertiary hidden lg:block w-24 text-right">Atualizado</span>
          </div>
          {clients.map((client) => (
            <ClientListRow
              key={client.id}
              client={client}
              onClick={() => navigate(`/crm/${client.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages != null && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-text-secondary px-2">
            {page} / {meta.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= (meta.totalPages ?? 1)}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo Cliente"
        description="Preencha as informações do cliente"
        size="md"
      >
        <CreateClientForm
          onSubmit={async (data) => {
            await createClient.mutateAsync(data);
            setCreateOpen(false);
          }}
          loading={createClient.isPending}
        />
      </Modal>
    </div>
  );
}
