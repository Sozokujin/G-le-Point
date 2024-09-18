import useUserStore from '@/stores/userStore';
import { useFriendStore } from '@/stores/friendStore';
import { useMarkerStore } from '@/stores/markerStore';
import { useGroupStore } from '@/stores/groupStore';

export const clearAllStores = () => {
    useUserStore.getState().reset();
    useFriendStore.getState().reset();
    useMarkerStore.getState().reset();
    useGroupStore.getState().reset();
};
