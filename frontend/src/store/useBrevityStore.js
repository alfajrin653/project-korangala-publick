import { create } from 'zustand';

// Global state untuk toggle "Full Article Mode" <-> "Axios Smart Brevity Mode"
// Dipakai di Header dan semua komponen artikel agar sinkron di seluruh halaman.
export const useBrevityStore = create((set) => ({
  isBrevity: false,
  toggleBrevity: () => set((state) => ({ isBrevity: !state.isBrevity })),
  setBrevity: (value) => set({ isBrevity: value }),
}));
