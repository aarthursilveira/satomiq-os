import { Outlet } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar.js";
import { Topbar } from "@/layouts/Topbar.js";
import { CommandPalette } from "@/components/CommandPalette.js";
import { ToastContainer } from "@/components/feedback/Toast.js";

export function AppLayout(): JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
