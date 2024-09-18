import { create } from 'zustand';
import { getFriendsTopUsersByScore, getTopUsersByScore } from '@/services/firebase/leaderboard';
import { getUserById, getUserLikeCount, getUsersByIds } from '@/services/firebase/user';
import { decrementSuperMarkers } from '@/services/firebase/profil';
import { FirebaseUser } from '@/types';

type UserStore = {
    currentUser: FirebaseUser | null;
    users: FirebaseUser[];
    topUsersByScore: FirebaseUser[];
    topFriendsUsersByScore: FirebaseUser[];
    userLikeCount: number;
    setCurrentUser: (currentUser: FirebaseUser) => void;
    clearCurrentUser: () => void;
    setUsers: (users: FirebaseUser[]) => void;
    clearUsers: () => void;
    fetchUserById: (id: string) => void;
    fetchUsersByIds: (ids: string[]) => void;
    fetchUserByScores: () => void;
    fetchFriendsUserByScores: (userId: string) => void;
    fetchUserLikeCount: (userId: string) => void;
    decrementCurrentUserSuperMarkers: () => void;
    reset: () => void;
};

const initialState: Omit<
    UserStore,
    | 'setCurrentUser'
    | 'clearCurrentUser'
    | 'setUsers'
    | 'clearUsers'
    | 'fetchUserById'
    | 'fetchUsersByIds'
    | 'fetchUserByScores'
    | 'fetchFriendsUserByScores'
    | 'fetchUserLikeCount'
    | 'decrementCurrentUserSuperMarkers'
    | 'reset'
> = {
    currentUser: null,
    users: [],
    topUsersByScore: [],
    topFriendsUsersByScore: [],
    userLikeCount: 0
};

const useUserStore = create<UserStore>((set) => ({
    ...initialState,
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
    },
    fetchUserLikeCount: async (userId: string) => {
        const likeCount =  await getUserLikeCount(userId);
        set({ userLikeCount: likeCount });
    },
    decrementCurrentUserSuperMarkers: async () => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;

        currentUser.superMarkers -= 1;

        await decrementSuperMarkers(currentUser.uid);
    },
    reset: () => set(initialState)
}));

export default useUserStore;
