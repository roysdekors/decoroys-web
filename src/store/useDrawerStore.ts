import { create } from 'zustand';

export type DrawerType = 'cart' | 'profile' | null;

interface DrawerState {
  isOpen: boolean;
  view: DrawerType;
  openDrawer: (view: DrawerType) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  view: null,
  openDrawer: (view) => set({ isOpen: true, view }),
  closeDrawer: () => set({ isOpen: false }),
}));
