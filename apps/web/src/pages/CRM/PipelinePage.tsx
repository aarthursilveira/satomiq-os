import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { GitBranch, ExternalLink, DollarSign } from "lucide-react";
import { usePipelines, usePipelineEntries, useMoveEntry } from "@/hooks/usePipeline.js";
import { Avatar } from "@/components/ui/Avatar.js";
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
  isDefault: boolean;
  stages: PipelineStage[];
}

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
  onNavigate,
}: {
  stage: PipelineStage;
  onNavigate: (clientId: string) => void;
}): JSX.Element {
  const totalValue = stage.entries.reduce(
    (sum, e) => sum + Number(e.value ?? e.client.contractValue ?? 0),
    0,
  );

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Stage header */}
      <div className="flex items-center gap-2 mb-3 px-1">
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
    </div>
  );
}

export default function PipelinePage(): JSX.Element {
  const navigate = useNavigate();
  const { data: pipelines, isLoading: loadingPipelines } = usePipelines();
  const pipelinesList = (pipelines as PipelineData[] | undefined) ?? [];
  const defaultPipeline = pipelinesList.find((p) => p.isDefault) ?? pipelinesList[0];

  const { data: pipelineData, isLoading: loadingEntries } = usePipelineEntries(
    defaultPipeline?.id ?? "",
  );

  const moveEntry = useMoveEntry(defaultPipeline?.id ?? "");
  const pipeline = pipelineData as PipelineData | undefined;

  const isLoading = loadingPipelines || loadingEntries;

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

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-semibold text-text-primary font-display tracking-tight">
            {pipeline?.name ?? "Pipeline"}
          </h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            {totalValue > 0
              ? `${formatCurrency(totalValue)} no funil`
              : "Arraste e solte para mover clientes entre etapas"}
          </p>
        </div>
      </motion.div>

      {/* Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-72 flex-shrink-0">
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
          title="Nenhum pipeline configurado"
          description="Configure um pipeline para começar a gerenciar seu funil de vendas."
        />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
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
                    onNavigate={(clientId) => navigate(`/crm/${clientId}`)}
                  />
                </motion.div>
              ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
