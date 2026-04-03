import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  MapPin,
  Edit,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Activity,
  CheckSquare,
  Image,
  Contact,
} from "lucide-react";
import { useClient } from "@/hooks/useClients.js";
import { Button } from "@/components/ui/Button.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { Skeleton, SkeletonText } from "@/components/feedback/Skeleton.js";
import { formatCurrency, formatDate, CLIENT_TYPE_LABELS } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";
import { NotesTab } from "@/pages/CRM/components/NotesTab.js";
import { ActivitiesTab } from "@/pages/CRM/components/ActivitiesTab.js";
import { TasksTab } from "@/pages/CRM/components/TasksTab.js";
import { ContactsTab } from "@/pages/CRM/components/ContactsTab.js";
import { ContentTab } from "@/pages/CRM/components/ContentTab.js";

type Tab = "overview" | "notes" | "activities" | "tasks" | "content" | "contacts";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Visão Geral", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "notes", label: "Notas", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "activities", label: "Atividades", icon: <Activity className="w-3.5 h-3.5" /> },
  { id: "tasks", label: "Tarefas", icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { id: "content", label: "Conteúdo", icon: <Image className="w-3.5 h-3.5" /> },
  { id: "contacts", label: "Contatos", icon: <Contact className="w-3.5 h-3.5" /> },
];

interface ClientData {
  id: string;
  name: string;
  type: string;
  slug: string;
  status: string;
  avatarUrl: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  address: string | null;
  contractValue: number | null;
  contractStart: string | null;
  contractEnd: string | null;
  paymentDay: number | null;
  tags: string[];
  createdAt: string;
  _count: {
    tasks: number;
    notes: number;
    projects: number;
    activities: number;
    contentItems: number;
  };
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }): JSX.Element {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-tertiary mb-0.5">{label}</p>
        <p className="text-sm text-text-primary break-all">{value}</p>
      </div>
    </div>
  );
}

export default function ClientProfilePage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data: clientData, isLoading } = useClient(id ?? "");
  const client = clientData as ClientData | undefined;

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex gap-4">
          <div className="w-72 flex-shrink-0">
            <div className="card p-5 flex flex-col gap-3">
              <Skeleton circle className="w-16 h-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
              <SkeletonText lines={4} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {TABS.map((t) => <Skeleton key={t.id} className="h-8 w-24 rounded-md" />)}
            </div>
            <div className="card p-5">
              <SkeletonText lines={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return <></>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-5"
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate("/crm")}
        >
          Clientes
        </Button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar — Client Info */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4"
        >
          {/* Identity Card */}
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <Avatar name={client.name} src={client.avatarUrl} size="lg" />
              <Button variant="ghost" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                Editar
              </Button>
            </div>

            <h1 className="text-base font-semibold text-text-primary leading-snug mb-1">
              {client.name}
            </h1>
            <p className="text-xs text-text-tertiary mb-3">
              {CLIENT_TYPE_LABELS[client.type] ?? client.type}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={client.status} />
              {client.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary border border-border-subtle rounded text-text-tertiary">
                  {tag}
                </span>
              ))}
            </div>

            {client.description && (
              <p className="text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
                {client.description}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="card px-4 py-2 divide-y divide-border-subtle">
            {client.email && (
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={client.email} />
            )}
            {client.phone && (
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Telefone" value={client.phone} />
            )}
            {client.whatsapp && (
              <InfoRow icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp" value={client.whatsapp} />
            )}
            {client.instagram && (
              <InfoRow icon={<Instagram className="w-4 h-4" />} label="Instagram" value={client.instagram} />
            )}
            {client.website && (
              <InfoRow icon={<Globe className="w-4 h-4" />} label="Website" value={client.website} />
            )}
            {client.address && (
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Endereço" value={client.address} />
            )}
          </div>

          {/* Commercial Info */}
          {(client.contractValue != null || client.contractStart || client.paymentDay) && (
            <div className="card px-4 py-2 divide-y divide-border-subtle">
              {client.contractValue != null && (
                <InfoRow
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Valor do Contrato"
                  value={`${formatCurrency(Number(client.contractValue))}/mês`}
                />
              )}
              {client.contractStart && (
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Início do Contrato"
                  value={formatDate(client.contractStart)}
                />
              )}
              {client.paymentDay != null && (
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Dia de Pagamento"
                  value={`Dia ${client.paymentDay} de cada mês`}
                />
              )}
            </div>
          )}

          {/* Stats */}
          <div className="card p-4">
            <p className="text-xs font-medium text-text-tertiary mb-3">Resumo</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Tarefas", value: client._count.tasks },
                { label: "Notas", value: client._count.notes },
                { label: "Projetos", value: client._count.projects },
              ].map((stat) => (
                <div key={stat.label} className="bg-bg-tertiary rounded-lg p-2.5 text-center">
                  <p className="text-base font-semibold text-text-primary">{stat.value}</p>
                  <p className="text-[10px] text-text-tertiary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="flex-1 min-w-0 flex flex-col gap-4"
        >
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150",
                  activeTab === tab.id
                    ? "bg-bg-tertiary text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary/50",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "overview" && <OverviewTab client={client} />}
            {activeTab === "notes" && <NotesTab clientId={client.id} />}
            {activeTab === "activities" && <ActivitiesTab clientId={client.id} />}
            {activeTab === "tasks" && <TasksTab clientId={client.id} />}
            {activeTab === "content" && <ContentTab clientId={client.id} />}
            {activeTab === "contacts" && <ContactsTab clientId={client.id} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OverviewTab({ client }: { client: ClientData }): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Sobre o Cliente</h2>
        {client.description ? (
          <p className="text-sm text-text-secondary leading-relaxed">{client.description}</p>
        ) : (
          <p className="text-sm text-text-tertiary italic">Nenhuma descrição adicionada.</p>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Tags</h2>
        {client.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {client.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-bg-tertiary border border-border-default rounded-full text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-tertiary italic">Nenhuma tag adicionada.</p>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-1">Cliente desde</h2>
        <p className="text-sm text-text-secondary">{formatDate(client.createdAt)}</p>
      </div>
    </div>
  );
}
