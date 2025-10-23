import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Branch } from '@/lib/types';

interface BranchState {
  selectedBranch: Branch | null;
  selectBranch: (branch: Branch) => void;
  // La lista de branches se manejará a través de useBranches (React Query)
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: null,
      selectBranch: (branch) => {
        set({ selectedBranch: branch });
      },
    }),
    {
      name: 'branch-storage',
      // Solo persistimos la sucursal seleccionada, no la lista completa
      partialize: (state) => ({ selectedBranch: state.selectedBranch }),
    }
  )
);