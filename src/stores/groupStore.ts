import { getAllGroups } from '@/services/firebase/groups';
import { Group } from '@/types';
import { create } from 'zustand';

interface GroupState {
    groups: Group[];
    filteredGroups: Group[];
    getGroups: () => Promise<void>;
    setFilteredGroups: (groups: Group[]) => void;
    addGroup: (group: Group) => void;
    removeGroup: (groupId: string) => void;
    clearGroups: () => void;
    updateGroupMembers: (groupId: string, removedUserId: string) => void;
    updateGroup: (groupId: string, updates: Partial<Group>) => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
    groups: [],
    filteredGroups: [],
    getGroups: async () => {
        const fetchedGroups = await getAllGroups();
        set({ groups: fetchedGroups, filteredGroups: fetchedGroups });
    },
    setFilteredGroups: (groups) => set({ filteredGroups: groups }),
    addGroup: (group) =>
        set((state) => ({
            groups: [...state.groups, group],
            filteredGroups: [...state.filteredGroups, group]
        })),
    removeGroup: (groupId) =>
        set((state) => ({
            groups: state.groups.filter((g) => g.id !== groupId),
            filteredGroups: state.filteredGroups.filter((g) => g.id !== groupId)
        })),
    clearGroups: () => set({ groups: [], filteredGroups: [] }),
    updateGroupMembers: (groupId: string, removedUserId: string) =>
        set((state) => ({
            groups: state.groups.map((group) =>
                group.id === groupId
                    ? { ...group, members: group.members.filter((memberId) => memberId !== removedUserId) }
                    : group
            ),
            filteredGroups: state.filteredGroups.map((group) =>
                group.id === groupId
                    ? { ...group, members: group.members.filter((memberId) => memberId !== removedUserId) }
                    : group
            )
        })),
    updateGroup: (groupId: string, updates: Partial<Group>) =>
        set((state) => ({
            groups: state.groups.map((group) =>
                group.id === groupId ? { ...group, ...updates } : group
            ),
            filteredGroups: state.filteredGroups.map((group) =>
                group.id === groupId ? { ...group, ...updates } : group
            ),
        })),
}));