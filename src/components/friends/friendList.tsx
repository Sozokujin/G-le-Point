import  useFriendStore from "@/stores/friendStore";
import { useEffect } from "react";

export const FriendList = () => {
    const { friends, getFriends } = useFriendStore();

    useEffect(() => {
        if(friends.length === 0) {
            getFriends();
        }
    }, [getFriends]);

    return(
    <div>
    <h2 className="text-primary text-xl font-bold px-2 py-4">Vos amis</h2>
    <ul className="flex gap-3">
      {friends.length !== 0 ? (
        friends.map((friend, key) => {
          return (
            <FriendLine key={key} friend={friend} />
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

const FriendLine = ({ friend }: { friend: any }) => {
    return (
      <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
        <span className="text-primary font-semibold">{friend.displayName}</span>
      </li>
    );
  }


