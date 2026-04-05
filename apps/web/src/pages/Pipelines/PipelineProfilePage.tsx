import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitBranch,
  ExternalLink,
  DollarSign,
  Plus,
  Layers,
  Trash2,
} from "lucide-react";
import {
  usePipelineEntries,
  useMoveEntry,
  useCreateStage,
  useDeleteStage,
} from "@/hooks/usePipeline.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { Modal } from "@/components/ui/Modal.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { Skeleton } from "@/components/feedback/Skeleton.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { formatCurrency } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface StageEntry {
  id: string;
  value: number | null;
  notes: string | null;
  enteredAt: string;
  client: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    status: string;
    type: string;
    contractValue: number | null;
  };
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  entries: StageEntry[];
}

interface PipelineData {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isDefault: boolean;
  stages: PipelineStage[];
}

const STAGE_COLOR_OPTIONS: string[] = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#06B6D4",
  "#6B7280",
];

const DEFAULT_STAGE_COLOR = "#3B82F6";

function PipelineCard({
  entry,
  index,
  onNavigate,
}: {
  entry: StageEntry;
  index: number;
  onNavigate: () => void;
}): JSX.Element {
  const displayValue = entry.value ?? entry.client.contractValue;

  return (
    <Draggable draggableId={entry.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-bg-elevated border border-border-subtle rounded-lg p-3 cursor-grab active:cursor-grabbing",
            "hover:border-border-default transition-all duration-150 group",
            snapshot.isDragging && "shadow-modal scale-[1.02] rotate-1 border-accent-subtle",
          )}
        >
          <div className="flex items-start gap-2 mb-2">
            <Avatar name={entry.client.name} src={entry.client.avatarUrl} size="sm" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate leading-snug">
                {entry.client.name}
              </p>
              <StatusBadge status={entry.client.status} className="mt-1" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
              className="opacity-0 group-hover:opacity-100 p-1 text-text-tertiary hover:text-text-primary transition-all flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {entry.notes && (
            <p className="text-xs text-text-tertiary mb-2 line-clamp-2">{entry.notes}</p>
          )}

          {displayValue != null && (
            <div className="flex items-center gap-1 text-xs font-semibold text-status-success">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(Number(displayValue))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

function StageColumn({
  stage,
  pipelineId,
  onNavigate,
}: {
  stage: PipelineStage;
  pipelineId: string;
  onNavigate: (clientId: string) => void;
}): JSX.Element {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteStage = useDeleteStage(pipelineId);

  const totalValue = stage.entries.reduce(
    (sum, e) => sum + Number(e.value ?? e.client.contractValue ?? 0),
    0,
  );

  return (
    <div className="flex flex-col w-64 sm:w-72 flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
      {/* Stage header */}
      <div className="flex items-center gap-2 mb-3 px-1 group/header">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="text-sm font-semibold text-text-primary flex-1 truncate">
          {stage.name}
        </h3>
        <span className="text-xs text-text-tertiary bg-bg-tertiary border border-border-subtle rounded-full px-2 py-0.5">
          {stage.entries.length}
        </span>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-1 rounded text-text-tertiary hover:text-status-error hover:bg-bg-tertiary transition-colors opacity-0 group-hover/header:opacity-100"
          title="Excluir coluna"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {totalValue > 0 && (
        <p className="text-xs text-text-tertiary px-1 mb-2">
          {formatCurrency(totalValue)}
        </p>
      )}

      {/* Drop zone */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-col gap-2 flex-1 min-h-[120px] p-2 rounded-xl transition-colors duration-150",
              "bg-bg-tertiary/40 border border-border-subtle",
              snapshot.isDraggingOver && "bg-accent-subtle/30 border-accent-subtle",
            )}
          >
            {stage.entries.map((entry, index) => (
              <PipelineCard
                key={entry.id}
                entry={entry}
                index={index}
                onNavigate={() => onNavigate(entry.client.id)}
              />
            ))}
            {provided.placeholder}

            {stage.entries.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 border border-dashed border-border-subtle rounded-lg">
                <p className="text-xs text-text-tertiary">Arraste aqui</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Delete stage confirmation */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Excluir Coluna"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Excluir <strong className="text-text-primary">{stage.name}</strong>?
            {stage.entries.length > 0 && (
              <> Os <strong>{stage.entries.length}</strong> itens desta coluna também serão removidos.</>
            )}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleteStage.isPending}
              onClick={async () => {
                await deleteStage.mutateAsync(stage.id);
                setConfirmDelete(false);
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PipelineProfilePage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pipelineData, isLoading } = usePipelineEntries(id ?? "");
  const moveEntry = useMoveEntry(id ?? "");
  const createStage = useCreateStage(id ?? "");

  const pipeline = pipelineData as PipelineData | undefined;

  // Add stage form
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stageName, setStageName] = useState("");
  const [stageColor, setStageColor] = useState(DEFAULT_STAGE_COLOR);

  function onDragEnd(result: DropResult): void {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) return;

    moveEntry.mutate({
      entryId: result.draggableId,
      stageId: result.destination.droppableId,
    });
  }

  const totalValue = pipeline?.stages.reduce(
    (sum, stage) =>
      sum + stage.entries.reduce(
        (s, e) => s + Number(e.value ?? e.client.contractValue ?? 0), 0,
      ),
    0,
  ) ?? 0;

  const totalEntries = pipeline?.stages.reduce(
    (sum, stage) => sum + stage.entries.length, 0,
  ) ?? 0;

  async function handleCreateStage(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!stageName.trim()) return;
    await createStage.mutateAsync({
      name: stageName.trim(),
      color: stageColor,
    });
    setStageModalOpen(false);
    setStageName("");
    setStageColor(DEFAULT_STAGE_COLOR);
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/pipelines")}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            {pipeline && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${pipeline.color}20` }}
              >
                <GitBranch className="w-4.5 h-4.5" style={{ color: pipeline.color }} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-text-primary font-display tracking-tight">
                {pipeline?.name ?? "Pipeline"}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                {pipeline?.description && (
                  <p className="text-sm text-text-tertiary">{pipeline.description}</p>
                )}
                {!pipeline?.description && totalValue > 0 && (
                  <p className="text-sm text-text-tertiary">{formatCurrency(totalValue)} no funil</p>
                )}
                <span className="text-xs text-text-tertiary bg-bg-tertiary border border-border-subtle rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {totalEntries} {totalEntries === 1 ? "item" : "itens"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setStageModalOpen(true)}
        >
          Nova Coluna
        </Button>
      </motion.div>

      {/* Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-64 sm:w-72 flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton circle className="w-2.5 h-2.5" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-6 rounded-full ml-auto" />
              </div>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 2 + i }, (_, j) => (
                  <div key={j} className="bg-bg-tertiary rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton circle className="w-8 h-8" />
                      <div className="flex-1">
                        <Skeleton className="h-3.5 w-2/3 mb-1.5" />
                        <Skeleton className="h-4 w-14 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !pipeline || pipeline.stages.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="w-5 h-5" />}
          title="Nenhuma coluna configurada"
          description="Adicione colunas para começar a organizar os itens deste pipeline."
          action={
            <Button
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setStageModalOpen(true)}
            >
              Criar primeira coluna
            </Button>
          }
        />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1 scroll-smooth" style={{ scrollSnapType: "x mandatory" }}>
            {pipeline.stages
              .sort((a, b) => a.order - b.order)
              .map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <StageColumn
                    stage={stage}
                    pipelineId={pipeline.id}
                    onNavigate={(clientId) => navigate(`/crm/${clientId}`)}
                  />
                </motion.div>
              ))}
          </div>
        </DragDropContext>
      )}

      {/* Create Stage Modal */}
      <Modal
        open={stageModalOpen}
        onClose={() => { setStageModalOpen(false); setStageName(""); setStageColor(DEFAULT_STAGE_COLOR); }}
        title="Nova Coluna"
        description="Adicione uma etapa ao pipeline"
        size="sm"
      >
        <form onSubmit={handleCreateStage} className="flex flex-col gap-4">
          <Input
            label="Nome da coluna"
            placeholder="Ex: Primeiro Contato"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Cor
            </label>
            <div className="flex items-center gap-2">
              {STAGE_COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setStageColor(color)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all duration-150",
                    stageColor === color
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
              onClick={() => { setStageModalOpen(false); setStageName(""); setStageColor(DEFAULT_STAGE_COLOR); }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createStage.isPending}
              disabled={!stageName.trim()}
            >
              Criar Coluna
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
