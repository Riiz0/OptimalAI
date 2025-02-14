import { create } from 'zustand';

interface DemoStore {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  isDemoMode: false,
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
}));
