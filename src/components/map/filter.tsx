import React from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface FilterProps {
  showFriends: boolean;
  setShowFriends: (value: boolean) => void;
  showGroups: boolean;
  setShowGroups: (value: boolean) => void;
}

const Filter: React.FC<FilterProps> = ({
  showFriends,
  setShowFriends,
  showGroups,
  setShowGroups,
}) => {
  return (
    <div className="absolute top-12 left-3 flex flex-col bg-white p-2 rounded-md z-10 gap-4">
      <h2 className="text-lg font-bold">Filtres</h2>
      <Label htmlFor="showFriends">Afficher les points des amis</Label>
      <Switch
        id="showFriends"
        checked={showFriends}
        onCheckedChange={() => setShowFriends(!showFriends)}
      />
      <Label htmlFor="showGroups"> Afficher les points des groupes </Label>
      <Switch
        id="showGroups"
        checked={showGroups}
        onCheckedChange={() => setShowGroups(!showGroups)}
      />
    </div>
  );
};

export default Filter;
