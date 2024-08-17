import { Card } from "@/components/ui/card";
import { useGroupStore } from "@/stores/groupStore";
import { useEffect } from "react";
import { ModalCreateGroup } from "./modalCreateGroup";

export const GroupList = () => {
  const { groups, getGroups } = useGroupStore();

  useEffect(() => {
    if (groups.length === 0) {
      getGroups();
    }
  }, [getGroups]);

  return (
    <Card className="md:w-1/4 p-5 flex flex-col gap-4">
      <h2 className="text-primary text-xl font-bold">Vos groupes</h2>
      <ModalCreateGroup />
      {groups.map((group) => (
        <GroupLine key={group.id} group={group} />
      ))}
    </Card>
  );
};

const GroupLine = ({ group }: { group: any }) => {
  return (
    <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
      <span className="text-primary font-semibold">{group.name}</span>
    </li>
  );
};
