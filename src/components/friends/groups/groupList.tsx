import GroupAvatar, { AvatarUser } from "@/components/ui/group-avatar";
import { Card } from "@/components/ui/card";
import { useGroupStore } from "@/stores/groupStore";
import { useEffect, useState } from "react";
import { ModalCreateGroup } from "./ModalCreateGroup";
import {  FirebaseUser, Group } from "@/types";
import useUserStore from "@/stores/userStore";
export const GroupList = () => {
  const { groups, getGroups } = useGroupStore();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<{ [key: string]: AvatarUser[] }>({});

  const { users, fetchUsersByIds } = useUserStore();

  const selectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const transformToAvatarUser = (user: FirebaseUser): AvatarUser => ({
    id: user.uid,
    name: user.displayName || user.email || 'Unknown User',
    image: user.photoURL,
  });

  useEffect(() => {
    if (groups.length === 0) {
      getGroups();
    }
  }, [getGroups, groups.length]);

  useEffect(() => {
    const groupMembersIds = groups.reduce((acc, group) => [...acc, ...group.members], [] as string[]);
    fetchUsersByIds(groupMembersIds);
    if (users) {
      setGroupUsers(
        groups.reduce((acc, group) => {
          acc[group.id] = group.members
            .map((memberId) => users.find((user) => user.uid === memberId))
            .filter((user): user is FirebaseUser => user !== undefined)
            .map(transformToAvatarUser);
          return acc;
        }, {} as { [key: string]: AvatarUser[] })
      );
    }
  },[fetchUsersByIds, groups, users]);

  return (
    <Card className="p-5 flex flex-col gap-4 h-full">
      <h2 className="text-primary text-xl font-bold">Vos groupes</h2>
      <ModalCreateGroup />
      {groups.map((group) => (
        <GroupLine
          key={group.id}
          group={group}
          groupUsers={groupUsers[group.id] || []}
          selected={selectedGroup?.id === group.id}
          onSelect={() => selectGroup(group)}
        />
      ))}
    </Card>
  );
};

const GroupLine = ({
  group,
  groupUsers,
  selected,
  onSelect,
} : {
    group: Group;
    groupUsers: AvatarUser[];
    selected: boolean;
    onSelect?: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200 ${
        selected ? "bg-slate-100" : ""
      }`}
      onClick={onSelect}
    >
      <GroupAvatar users={groupUsers} size="sm" />
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none truncate">
          {group.name || "Groupe sans nom"}
        </p>
        <p className="text-xs text-muted-foreground truncate">{groupUsers.length} Membres</p>
      </div>
      <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ml-auto">POINT NBR</span>
    </div>
  );
};
