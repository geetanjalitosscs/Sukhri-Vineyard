import { create } from "zustand";

interface DashboardState {
  selectedVineyard: string;
  dateRange: { start: Date; end: Date };
  setSelectedVineyard: (vineyard: string) => void;
  setDateRange: (range: { start: Date; end: Date }) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedVineyard: "all",
  dateRange: {
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  },
  setSelectedVineyard: (vineyard) => set({ selectedVineyard: vineyard }),
  setDateRange: (range) => set({ dateRange: range }),
}));

