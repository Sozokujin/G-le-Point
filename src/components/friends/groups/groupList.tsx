import { Card } from "@/components/ui/card";
import { useGroupStore } from "@/stores/groupStore";
import { useEffect, useState } from "react";
import { ModalCreateGroup } from "./ModalCreateGroup";
import { Group } from "@/types";
import GroupAvatar, { AvatarUser } from "@/components/ui/group-avatar";
import { getUserById } from "@/services/firebase/user";

export const GroupList = () => {
  const { groups, getGroups } = useGroupStore();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const selectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    if (groups.length === 0) {
      getGroups();

    }
  }, [getGroups, groups.length]);

  return (
    <Card className="p-5 flex flex-col gap-4 h-full">
      <h2 className="text-primary text-xl font-bold">Vos groupes</h2>
      <ModalCreateGroup />
      {groups.map((group) => (
        <GroupLine
          key={group.id}
          group={group}
          selected={selectedGroup?.id === group.id}
          onSelect={() => selectGroup(group)}
        />
      ))}
    </Card>
  );
};

const GroupLine = ({ group, selected, onSelect }: { group: Group; selected: boolean; onSelect?: () => void; }) => {
  const [users, setUsers] = useState<AvatarUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const resolvedUsers = await Promise.all(
        group.members.map(async (userId) => {
          const user = await getUserById(userId);
          if (!user) return null;
          return {
            id: user.uid || "",
            name: user.displayName || "",
            image: user.photoURL || "",
          };
        })
      );
      setUsers(resolvedUsers.filter((user) => user !== null) as AvatarUser[]);
    };

    fetchUsers();
  }, [group.members]);

  return (
    <div
      className={`flex items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200 ${
        selected ? "bg-slate-100" : ""
      }`}
      onClick={onSelect}
    >
      <GroupAvatar users={users} size="sm" />
      <div className="grid grid-flow-col grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <p className="col-span-1 md:col-span-2 lg:col-span-3 text-sm font-medium leading-none truncate w-full">
          {group.name}
        </p>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{users.length}</span>
      </div>
    </div>
  );
};
