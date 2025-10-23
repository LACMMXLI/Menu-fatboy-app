import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { branches } from '@/lib/data';
import type { Branch } from '@/lib/types';

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  selectBranch: (branchId: string) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branches: branches,
      selectedBranch: null,
      selectBranch: (branchId) => {
        const branch = branches.find((b) => b.id === branchId);
        set({ selectedBranch: branch || null });
      },
    }),
    {
      name: 'branch-storage',
    }
  )
);