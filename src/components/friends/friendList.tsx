import  { useFriendStore } from "@/stores/friendStore";
import { useEffect } from "react";
import { ModalCreateGroup } from "./groups/ModalCreateGroup";
import { GroupList } from "./groups/groupList";

export const FriendList = () => {
    const { friends, getFriends } = useFriendStore();

    useEffect(() => {
        if(friends.length === 0) {
            getFriends();
        }
    }, [getFriends]);

    return(
    <div>
      <GroupList></GroupList>
    <h2 className="text-primary text-xl font-bold px-2 py-4">Vos amis</h2>
    <ul className="flex gap-3">
      {friends.length !== 0 ? (
        friends.map((friend, key) => {
          return (
            <FriendLine key={key} friend={friend} selected />
          );
        })
      ) : (
        <div>
          <p>Vous n&apos;avez pas encore d&apos;amis</p>
        </div>
      )}
    </ul>
  </div>
    )
}

export const FriendLine = ({ friend, selected = null}: { friend: any, selected: boolean | null },) => {
    return (
      <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
        <span className="text-primary font-semibold">{friend.displayName}</span>
      </li>
    );
  }


  export const SelectableFriendLine  = ({
    friend,
    selected,
    onSelect,
}: {
    friend: any;
    selected: boolean;
    onSelect: () => void;
}) => {
    return (
        <li
            className={`h-24 w-full border-primary border-y-2 p-2 rounded-sm cursor-pointer ${selected ? 'bg-blue-200' : 'bg-white'}`}
            onClick={onSelect}
        >
            <span className="text-primary font-semibold">{friend.displayName}</span>
        </li>
    );
};


