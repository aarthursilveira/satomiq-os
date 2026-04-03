import { useState } from "react";
import { motion } from "framer-motion";
import { Pin, Trash2, Plus, FileText } from "lucide-react";
import { useClientNotes, useCreateNote, useDeleteNote } from "@/hooks/useClients.js";
import { useAuthStore } from "@/stores/auth.store.js";
import { Button } from "@/components/ui/Button.js";
import { Textarea } from "@/components/ui/Textarea.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonText } from "@/components/feedback/Skeleton.js";
import { formatRelativeTime } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface NoteData {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; avatarUrl: string | null };
}

interface NotesTabProps {
  clientId: string;
}

export function NotesTab({ clientId }: NotesTabProps): JSX.Element {
  const { data, isLoading } = useClientNotes(clientId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const user = useAuthStore((s) => s.user);
  const [newContent, setNewContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const notesData = data?.data as NoteData[] | undefined;
  const notes = notesData ?? [];

  async function handleCreate(): Promise<void> {
    if (!newContent.trim()) return;
    await createNote.mutateAsync({ content: newContent, clientId });
    setNewContent("");
    setIsWriting(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* New note composer */}
      <div className="card p-4">
        {isWriting ? (
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Escreva uma nota em Markdown..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setIsWriting(false); setNewContent(""); }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreate}
                loading={createNote.isPending}
                disabled={!newContent.trim()}
              >
                Adicionar Nota
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWriting(true)}
            className="w-full text-left text-sm text-text-tertiary hover:text-text-secondary py-1 transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar nota...
          </button>
        )}
      </div>

      {/* Notes list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="card p-4">
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-5 h-5" />}
          title="Nenhuma nota ainda"
          description="Adicione notas para documentar reuniões, feedbacks e insights."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "card p-4 group",
                note.isPinned && "border-accent-subtle bg-accent-subtle/10",
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Avatar name={note.author.name} src={note.author.avatarUrl} size="xs" />
                  <span className="text-xs text-text-tertiary">{note.author.name}</span>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-xs text-text-tertiary">
                    {formatRelativeTime(note.createdAt)}
                  </span>
                  {note.isPinned && (
                    <Pin className="w-3 h-3 text-accent-primary" />
                  )}
                </div>
                {user?.id === note.author.id && (
                  <button
                    onClick={() => deleteNote.mutate({ id: note.id, clientId })}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-tertiary hover:text-status-error transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
