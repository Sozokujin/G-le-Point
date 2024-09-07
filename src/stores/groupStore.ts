import { Group } from '@/types';
import { create } from 'zustand';
import { getAllGroups } from '@/services/firebase/groups';

export const useGroupStore = create((set: any, get: any) => ({
    groups: [] as Group[],
    getGroups: async () => {
        const groups = await getAllGroups();
        set({ groups });
    },
    addGroup: (group: any) => set((state: any) => ({ groups: [...state.groups, group] })),
    removeGroup: (group: any) => set((state: any) => ({ groups: state.groups.filter((g: any) => g !== group) })),
    clearGroups: () => set({ groups: [] }),
}));
