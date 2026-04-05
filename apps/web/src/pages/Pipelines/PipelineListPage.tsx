import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  GitBranch,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { usePipelines, useCreatePipeline, useDeletePipeline } from "@/hooks/usePipeline.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Modal } from "@/components/ui/Modal.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonCard } from "@/components/feedback/Skeleton.js";
import { formatRelativeTime } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface PipelineRecord {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  stages: Array<{
    id: string;
    name: string;
    color: string;
    order: number;
    _count: { entries: number };
  }>;
}

const COLOR_OPTIONS: string[] = [
  "#2563EB",
  "#7C3AED",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#06B6D4",
  "#8B5CF6",
];

const DEFAULT_COLOR = "#2563EB";

function PipelineGridCard({
  pipeline,
  onClick,
  onDelete,
}: {
  pipeline: PipelineRecord;
  onClick: () => void;
  onDelete: () => void;
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalEntries = pipeline.stages.reduce((sum, s) => sum + s._count.entries, 0);

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
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${pipeline.color}20` }}
        >
          <GitBranch className="w-5 h-5" style={{ color: pipeline.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-hover transition-colors">
            {pipeline.name}
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            {pipeline.stages.length} {pipeline.stages.length === 1 ? "etapa" : "etapas"}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 top-7 z-20 w-36 bg-bg-elevated border border-border-default rounded-lg shadow-modal py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-status-error hover:bg-bg-tertiary transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {pipeline.description && (
        <p className="text-xs text-text-tertiary line-clamp-2 mb-3">{pipeline.description}</p>
      )}

      {pipeline.stages.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          {pipeline.stages.map((stage) => (
            <div
              key={stage.id}
              className="h-1.5 rounded-full flex-1"
              style={{ backgroundColor: stage.color }}
              title={`${stage.name} (${stage._count.entries})`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-text-tertiary border-t border-border-subtle pt-3 mt-3">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          <span>{totalEntries} {totalEntries === 1 ? "item" : "itens"}</span>
        </div>
        {pipeline.isDefault && (
          <span className="text-[10px] px-1.5 py-0.5 bg-accent-subtle border border-accent-subtle rounded text-accent-hover font-medium">
            Padrão
          </span>
        )}
        <span className="ml-auto">{formatRelativeTime(pipeline.updatedAt)}</span>
      </div>
    </motion.div>
  );
}

export default function PipelineListPage(): JSX.Element {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<PipelineRecord | null>(null);

  const { data: rawPipelines, isLoading } = usePipelines();
  const createPipeline = useCreatePipeline();
  const deletePipeline = useDeletePipeline();

  const pipelines = (rawPipelines as PipelineRecord[] | undefined) ?? [];

  // Create form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState(DEFAULT_COLOR);

  function resetForm(): void {
    setFormName("");
    setFormDescription("");
    setFormColor(DEFAULT_COLOR);
  }

  async function handleCreate(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!formName.trim()) return;
    await createPipeline.mutateAsync({
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      color: formColor,
    });
    setCreateOpen(false);
    resetForm();
  }

  async function handleDelete(): Promise<void> {
    if (!deleteConfirm) return;
    await deletePipeline.mutateAsync(deleteConfirm.id);
    setDeleteConfirm(null);
  }

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
            Pipelines
          </h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            {pipelines.length > 0
              ? `${pipelines.length} ${pipelines.length === 1 ? "pipeline" : "pipelines"} configurados`
              : "Gerencie seus funis e processos"}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setCreateOpen(true)}
        >
          Novo Pipeline
        </Button>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pipelines.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="w-5 h-5" />}
          title="Nenhum pipeline criado"
          description="Crie seu primeiro pipeline para organizar funis, cronogramas ou qualquer fluxo de etapas."
          action={
            <Button
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setCreateOpen(true)}
            >
              Criar primeiro pipeline
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pipelines.map((pipeline, i) => (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <PipelineGridCard
                pipeline={pipeline}
                onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                onDelete={() => setDeleteConfirm(pipeline)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); resetForm(); }}
        title="Novo Pipeline"
        description="Crie um novo funil ou fluxo de etapas"
        size="sm"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Ex: Funil de Vendas"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Descrição"
            placeholder="Descreva o objetivo deste pipeline..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Cor de destaque
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormColor(color)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all duration-150",
                    formColor === color
                      ? "ring-2 ring-offset-2 ring-offset-bg-elevated scale-110"
                      : "hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setCreateOpen(false); resetForm(); }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createPipeline.isPending}
              disabled={!formName.trim()}
            >
              Criar Pipeline
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Excluir Pipeline"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Tem certeza que deseja excluir <strong className="text-text-primary">{deleteConfirm?.name}</strong>?
            Todas as etapas e itens serão removidos permanentemente.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deletePipeline.isPending}
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
