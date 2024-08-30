import React from "react";

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
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 10,
        zIndex: 1,
        background: "#fff",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <label>
        <input
          type="checkbox"
          checked={showFriends}
          onChange={(e) => setShowFriends(e.target.checked)}
        />
        Afficher les points des amis
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={showGroups}
          onChange={(e) => setShowGroups(e.target.checked)}
        />
        Afficher les points des groupes
      </label>
    </div>
  );
};

export default Filter;
