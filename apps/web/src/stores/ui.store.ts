import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (value) => {
    set({ sidebarCollapsed: value });
  },

  openCommandPalette: () => {
    set({ commandPaletteOpen: true });
  },

  closeCommandPalette: () => {
    set({ commandPaletteOpen: false });
  },
}));
