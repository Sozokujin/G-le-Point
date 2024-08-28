import { getInvitationCode } from "@/services/firebase/friends";
import { useFriendStore } from "@/stores/friendStore";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { ModalListFriendRequest } from "./modalListfriendRequest";
import { ModalSendFriendRequest } from "./modalSendFriendRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendList = () => {
  const { friends, getFriends } = useFriendStore();

  const [showPopupCopy, setShowPopupCopy] = useState(false);
  const [showPopupSend, setShowPopupSend] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitationCode = async () => {
      const cachedCode = localStorage.getItem("invitationCode");

      if (cachedCode) {
        setInvitationCode(cachedCode);
      } else {
        const code = await getInvitationCode();
        setInvitationCode(code);
        localStorage.setItem("invitationCode", code);
      }
    };

    fetchInvitationCode();
  }, []);

  useEffect(() => {
    if (friends.length === 0) {
      getFriends();
    }
  }, [getFriends]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationCode || "");
    setShowPopupCopy(true);
    setTimeout(() => {
      setShowPopupCopy(false);
    }, 3000);
  };

  return (
    <Card className="relative p-5 flex flex-col gap-4">
      <h2 className="text-primary text-xl font-bold">Vos amis</h2>
      <div>
        Mon code :{" "}
        <span className="text-glp-green font-bold">{invitationCode}</span>
        <ClipboardDocumentIcon
          className="cursor-pointer ml-2 inline-block h-4 text-glp-green"
          onClick={() => copyToClipboard()}
        />
      </div>
      <ModalListFriendRequest />
      <ModalSendFriendRequest />
      <ul className="flex flex-col gap-3">
        {friends.length !== 0 ? (
          friends.map((friend, key) => {
            return <FriendLine key={key} friend={friend} selected />;
          })
        ) : (
          <div>
            <p>Vous n&apos;avez pas encore d&apos;amis</p>
          </div>
        )}
      </ul>
    </Card>
  );
};

export const FriendLine = ({
  friend,
  selected = null,
}: {
  friend: any;
  selected: boolean | null;
}) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage
          src={friend.photoURL}
          alt={`${friend.displayName}'s avatar`}
        />
        <AvatarFallback>
          {friend.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{friend.displayName}</p>
        <p className="text-sm text-muted-foreground">{friend.email}</p>
      </div>
    </div>
  );
};

export const SelectableFriendLine = ({
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
      className={`h-24 w-full border-primary border-y-2 p-2 rounded-sm cursor-pointer ${
        selected ? "bg-blue-200" : "bg-white"
      }`}
      onClick={onSelect}
    >
      <span className="text-primary font-semibold">{friend.displayName}</span>
    </li>
  );
};
