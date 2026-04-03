import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CheckSquare,
  FileText,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn.js";
import { useUIStore } from "@/stores/ui.store.js";
import { useAuthStore } from "@/stores/auth.store.js";
import { Avatar } from "@/components/ui/Avatar.js";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", to: "/dashboard" },
  { icon: <Users className="w-4 h-4" />, label: "CRM — Clientes", to: "/crm" },
  { icon: <GitBranch className="w-4 h-4" />, label: "Pipeline", to: "/crm/pipeline" },
  { icon: <CheckSquare className="w-4 h-4" />, label: "Tarefas", to: "/tasks" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: <Settings className="w-4 h-4" />, label: "Configurações", to: "/settings" },
];

export function Sidebar(): JSX.Element {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col h-full bg-bg-secondary border-r border-border-subtle overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              className="font-semibold text-sm text-text-primary tracking-tight font-display whitespace-nowrap"
            >
              SAtomiq-OS
            </motion.span>
          )}
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="ml-auto p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            title="Colapsar sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {!sidebarCollapsed && (
          <p className="px-2 mb-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-widest">
            Menu
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavItem item={item} collapsed={sidebarCollapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border-subtle flex flex-col gap-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} collapsed={sidebarCollapsed} />
        ))}

        {/* User profile */}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded px-2 py-2 mt-1",
            sidebarCollapsed && "justify-center",
          )}
          title={sidebarCollapsed ? user?.name : undefined}
        >
          <Avatar name={user?.name ?? "User"} size="sm" className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-text-tertiary truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function NavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}): JSX.Element {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 px-2 py-2 rounded text-sm transition-all duration-150 group relative",
          collapsed && "justify-center",
          isActive
            ? "bg-accent-subtle text-accent-hover"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn("flex-shrink-0", isActive && "text-accent-primary")}>
            {item.icon}
          </span>
          {!collapsed && (
            <span className="truncate font-medium text-[13px]">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="ml-auto text-[10px] font-semibold bg-accent-primary text-white rounded-full px-1.5 py-0.5">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
