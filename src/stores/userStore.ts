import { create } from 'zustand';
import { getFriendsTopUsersByScore, getTopUsersByScore } from '@/services/firebase/leaderboard';
import { getUserById, getUsersByIds } from '@/services/firebase/user';
import { FirebaseUser, UserStore } from '@/types';

const useUserStore = create<UserStore>((set) => ({
    currentUser: null,
    users: [],
    topUsersByScore: [],
    topFriendsUsersByScore: [],
    setCurrentUser: (currentUser: FirebaseUser) => set({ currentUser }),
    clearCurrentUser: () => set({ currentUser: null }),
    setUsers: (users: FirebaseUser[]) => set({ users }),
    clearUsers: () => set({ users: [] }),
    fetchUserById: async (id: string) => {
        const user = await getUserById(id);
        set((state) => {
            const userExists = state.users.some((u) => u.uid === user?.uid);
            if (userExists) return state; //sinon ca trigger un change de users et ca cree une infinite loop dans useEffect
            return { users: [...state.users, user].filter((u) => u !== null) };
        });
    },
    fetchUsersByIds: async (ids: string[]) => {
        if (ids.length === 0) return;
        const users = await getUsersByIds(ids);
        set((state) => {
            const newUsers = users.filter((user) => !state.users.some((u) => u.uid === user.uid));
            if (newUsers.length === 0) return state;
            return { users: [...state.users, ...newUsers] };
        });
    },
    fetchUserByScores: async () => {
        const users = await getTopUsersByScore();
        // const currentUser = useUserStore.getState().currentUser;
        set((state) => {
            const newUsers = users.filter((user) => !state.topUsersByScore.some((u) => u.uid === user.uid));
            // if (currentUser && !state.topUsersByScore.some((u) => u.uid === currentUser.uid)) {
            //     newUsers.push(currentUser);
            // }
            // if (newUsers.length === 0) return state;
            return { topUsersByScore: [...state.topUsersByScore, ...newUsers] };
        });
    },
    fetchFriendsUserByScores: async (userId: string) => {
        const users = await getFriendsTopUsersByScore(userId);
        // const currentUser = useUserStore.getState().currentUser;
        set((state) => {
            const newUsers = users.filter((user) => !state.topFriendsUsersByScore.some((u) => u.uid === user.uid));
            // if (currentUser && !state.topFriendsUsersByScore.some((u) => u.uid === currentUser.uid)) {
            //     newUsers.push(currentUser);
            // }
            if (newUsers.length === 0) return state;
            return {
                topFriendsUsersByScore: [...state.topFriendsUsersByScore, ...newUsers]
            };
        });
    }
}));

export default useUserStore;
