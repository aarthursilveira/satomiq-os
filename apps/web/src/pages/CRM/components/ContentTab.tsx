import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Plus, Calendar, Instagram, Globe } from "lucide-react";
import { useClientContent } from "@/hooks/useClients.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { Button } from "@/components/ui/Button.js";
import { Select } from "@/components/ui/Select.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonCard } from "@/components/feedback/Skeleton.js";
import { formatDate, CONTENT_TYPE_LABELS } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface ContentData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  platform: string[];
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "IDEA", label: "Ideia" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "IN_REVIEW", label: "Em Revisão" },
  { value: "SCHEDULED", label: "Agendado" },
  { value: "PUBLISHED", label: "Publicado" },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-3 h-3" />,
  blog: <Globe className="w-3 h-3" />,
};

function ContentCard({ item }: { item: ContentData }): JSX.Element {
  return (
    <div className="card p-4 hover:border-border-default hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-hover transition-colors">
            {item.title}
          </p>
          <p className="text-xs text-text-tertiary mt-0.5">
            {CONTENT_TYPE_LABELS[item.type] ?? item.type}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">{item.description}</p>
      )}

      <div className="flex items-center gap-3 mt-auto">
        <div className="flex items-center gap-1">
          {item.platform.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1 text-[10px] text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded"
            >
              {PLATFORM_ICONS[p] ?? <Globe className="w-3 h-3" />}
              {p}
            </span>
          ))}
        </div>
        {(item.scheduledAt ?? item.publishedAt) && (
          <div className="flex items-center gap-1 ml-auto text-xs text-text-tertiary">
            <Calendar className="w-3 h-3" />
            {formatDate((item.scheduledAt ?? item.publishedAt)!)}
          </div>
        )}
      </div>
    </div>
  );
}

export function ContentTab({ clientId }: { clientId: string }): JSX.Element {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useClientContent(clientId);

  const allItems = (data?.data as ContentData[] | undefined) ?? [];
  const items = statusFilter
    ? allItems.filter((i) => i.status === statusFilter)
    : allItems;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Select
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
          placeholder=""
        />
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Novo Conteúdo
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Image className="w-5 h-5" />}
          title="Nenhum conteúdo encontrado"
          description={statusFilter ? "Tente remover o filtro." : "Planeje e acompanhe o calendário de conteúdo deste cliente."}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
