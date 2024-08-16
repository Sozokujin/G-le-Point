import { useEffect } from "react";
import { useGroupStore } from "@/stores/groupStore";
import { useFriendStore } from "@/stores/friendStore";
import { ModalCreateGroup } from "./ModalCreateGroup";

export const GroupList = () => {

const { groups, getGroups } = useGroupStore();
const { friends, getFriends } = useFriendStore();

useEffect(() => {
    if(groups.length === 0) {
        getGroups();
    }
}
, [getGroups]);

  return (
    <div>
        <h2 className="text-primary text-xl font-bold px-2 py-4">Vos groupes</h2>
        <ModalCreateGroup/>
      {groups.map((group) => (
        <GroupLine key={group.id} group={group} />
      ))}
    </div>
  );
};


const GroupLine = ({ group }: { group: any }) => {
    return (
        <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
        <span className="text-primary font-semibold">{group.name}</span>
        </li>
    );
}