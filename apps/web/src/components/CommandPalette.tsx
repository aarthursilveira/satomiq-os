import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CheckSquare,
  Settings,
  Search,
  ArrowRight,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store.js";
import { cn } from "@/lib/cn.js";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

export function CommandPalette(): JSX.Element {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          useUIStore.getState().openCommandPalette();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, closeCommandPalette]);

  useEffect(() => {
    if (!commandPaletteOpen) setValue("");
  }, [commandPaletteOpen]);

  const commands: CommandItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Visão geral e KPIs",
      icon: <LayoutDashboard className="w-4 h-4" />,
      action: () => { navigate("/dashboard"); closeCommandPalette(); },
      group: "Navegação",
    },
    {
      id: "clients",
      label: "CRM — Clientes",
      description: "Lista de clientes",
      icon: <Users className="w-4 h-4" />,
      action: () => { navigate("/crm"); closeCommandPalette(); },
      group: "Navegação",
    },
    {
      id: "pipeline",
      label: "Pipeline",
      description: "Funil de vendas Kanban",
      icon: <GitBranch className="w-4 h-4" />,
      action: () => { navigate("/crm/pipeline"); closeCommandPalette(); },
      group: "Navegação",
    },
    {
      id: "tasks",
      label: "Tarefas",
      description: "Gerenciar tarefas",
      icon: <CheckSquare className="w-4 h-4" />,
      action: () => { navigate("/tasks"); closeCommandPalette(); },
      group: "Navegação",
    },
    {
      id: "settings",
      label: "Configurações",
      description: "Preferências do sistema",
      icon: <Settings className="w-4 h-4" />,
      action: () => { navigate("/settings"); closeCommandPalette(); },
      group: "Sistema",
    },
  ];

  const grouped = commands.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group]!.push(cmd);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            onClick={closeCommandPalette}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg"
          >
            <Command
              className="bg-bg-elevated border border-border-default rounded-xl shadow-modal overflow-hidden"
              value={value}
              onValueChange={setValue}
              shouldFilter
            >
              <div className="flex items-center border-b border-border-subtle px-4">
                <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                <Command.Input
                  placeholder="Buscar páginas, clientes, ações..."
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                />
                <kbd className="text-[10px] text-text-tertiary bg-bg-tertiary border border-border-default rounded px-1.5 py-0.5 font-mono">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[320px] overflow-y-auto py-2">
                <Command.Empty className="px-4 py-8 text-sm text-text-tertiary text-center">
                  Nenhum resultado encontrado.
                </Command.Empty>

                {Object.entries(grouped).map(([group, items]) => (
                  <Command.Group
                    key={group}
                    heading={
                      <span className="px-4 py-1 text-[11px] font-medium text-text-tertiary uppercase tracking-widest">
                        {group}
                      </span>
                    }
                  >
                    {items.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={item.label}
                        onSelect={item.action}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-md mx-2",
                          "text-sm text-text-secondary",
                          "transition-colors duration-100",
                          "data-[selected=true]:bg-accent-subtle data-[selected=true]:text-text-primary",
                          "hover:bg-bg-tertiary hover:text-text-primary",
                        )}
                      >
                        <span className="text-text-tertiary flex-shrink-0">
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-inherit">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-text-tertiary">{item.description}</p>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-data-[selected=true]:opacity-100" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
