import { create } from "zustand";

interface PanelState {
  panelAOpen: boolean;
  panelCOpen: boolean;
  togglePanelA: () => void;
  togglePanelC: () => void;
}

const usePanelStore = create<PanelState>((set) => ({
  panelAOpen: true,
  panelCOpen: true,
  togglePanelA: () => set((s) => ({ panelAOpen: !s.panelAOpen })),
  togglePanelC: () => set((s) => ({ panelCOpen: !s.panelCOpen })),
}));

export { usePanelStore };
