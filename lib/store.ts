import { create } from "zustand";

interface PanelState {
  panelAOpen: boolean;
  panelCOpen: boolean;
  panelCTab: "customize" | "code";
  togglePanelA: () => void;
  togglePanelC: () => void;
  setPanelCTab: (tab: "customize" | "code") => void;
}

const usePanelStore = create<PanelState>((set) => ({
  panelAOpen: true,
  panelCOpen: true,
  panelCTab: "code",
  togglePanelA: () => set((s) => ({ panelAOpen: !s.panelAOpen })),
  togglePanelC: () => set((s) => ({ panelCOpen: !s.panelCOpen })),
  setPanelCTab: (tab) => set({ panelCTab: tab }),
}));

type ParamValues = Record<string, string | number | boolean>;

interface CustomizerState {
  params: ParamValues;
  initParams: (defaults: ParamValues, overrides?: ParamValues) => void;
  setParam: (key: string, value: string | number | boolean) => void;
  resetParams: (defaults: ParamValues) => void;
}

const useCustomizerStore = create<CustomizerState>((set) => ({
  params: {},
  initParams: (defaults, overrides) => set({ params: { ...defaults, ...overrides } }),
  setParam: (key, value) => set((s) => ({ params: { ...s.params, [key]: value } })),
  resetParams: (defaults) => set({ params: { ...defaults } }),
}));

export { usePanelStore, useCustomizerStore };
export type { ParamValues };
