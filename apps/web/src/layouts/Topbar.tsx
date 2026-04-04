import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/cn.js";
import { useUIStore } from "@/stores/ui.store.js";
import { Button } from "@/components/ui/Button.js";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/crm": "CRM — Clientes",
  "/crm/pipeline": "Pipeline",
  "/tasks": "Tarefas",
  "/settings": "Configurações",
};

function getBreadcrumbs(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: string[] = ["SAtomiq-OS"];

  if (parts[0] === "crm" && parts.length > 1 && parts[1] !== "pipeline") {
    crumbs.push("CRM");
    crumbs.push("Perfil do Cliente");
  } else if (ROUTE_TITLES[pathname]) {
    crumbs.push(ROUTE_TITLES[pathname] ?? pathname);
  } else if (parts[0]) {
    crumbs.push(parts[0].charAt(0).toUpperCase() + parts[0].slice(1));
  }

  return crumbs;
}

export function Topbar(): JSX.Element {
  const { openCommandPalette, toggleSidebar, sidebarCollapsed, openSidebarMobile } = useUIStore();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="h-14 flex items-center gap-3 px-4 bg-bg-secondary border-b border-border-subtle flex-shrink-0">
      {/* Mobile hamburger — always visible on small screens */}
      <button
        onClick={openSidebarMobile}
        className="p-1.5 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Desktop hamburger — only when sidebar is collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="hidden md:block p-1.5 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          aria-label="Expandir sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-text-tertiary flex-shrink-0" />
            )}
            <span
              className={cn(
                "text-sm truncate",
                i === breadcrumbs.length - 1
                  ? "text-text-primary font-medium"
                  : "text-text-tertiary",
              )}
            >
              {crumb}
            </span>
          </div>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile: ícone de busca solo */}
        <button
          onClick={openCommandPalette}
          className="p-1.5 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors sm:hidden"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Desktop: botão com texto + atalho */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openCommandPalette}
          leftIcon={<Search className="w-3.5 h-3.5" />}
          className="hidden sm:flex text-text-tertiary text-xs"
        >
          Buscar
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] bg-bg-tertiary border border-border-default rounded font-mono">
            ⌘K
          </kbd>
        </Button>

        <button
          className="p-1.5 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors relative"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
