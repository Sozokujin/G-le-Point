import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"
import {
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { getInvitationCode } from "@/services/firebase/friends";
import { useFriendStore } from "@/stores/friendStore";
import { ModalListFriendRequest } from "./modalListfriendRequest";
import { ModalSendFriendRequest } from "./modalSendFriendRequest";
import { FirebaseUser } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card } from "../ui/card";

interface FriendListProps {
  onSelectedFriendChange: (friend: FirebaseUser | null) => void;
}


export const FriendList: React.FC<FriendListProps> = ({ onSelectedFriendChange }) => {
  const { getFriends, setSearchQuery, filteredFriends } = useFriendStore((state) => ({
    getFriends: state.getFriends,
    setSearchQuery: state.setSearchQuery,
    filteredFriends: state.filteredFriends,
  }));

  const [showPopupCopy, setShowPopupCopy] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(null);

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
    if (filteredFriends().length === 0) {
      getFriends();
    }
  }, [getFriends, filteredFriends]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationCode || "");
    setShowPopupCopy(true);
    setTimeout(() => {
      setShowPopupCopy(false);
    }, 3000);
  };

  useEffect(() => {
    onSelectedFriendChange(selectedFriend);
  }, [selectedFriend, onSelectedFriendChange]);

  const selectFriend = (friend: FirebaseUser) => {
    setSelectedFriend(friend);
  };

  return (
    <Card className="relative p-5 flex flex-col gap-4 h-full">
      <div className="w-full flex justify-between">
        <p className="text-primary text-3xl font-bold">Mes amis</p>
        <ModalSendFriendRequest />
      </div>
      <div className="flex sm:flex-col-reverse justify-between gap-2 lg:items-center lg:flex-row">
        <div>
          Mon code :{" "}
          <span className="text-glp-green font-bold">{invitationCode}</span>
          <ClipboardDocumentIcon
            className="cursor-pointer ml-2 inline-block h-4 text-glp-green"
            onClick={() => copyToClipboard()}
          />
        </div>
        <ModalListFriendRequest />
      </div>
      <Separator />
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8"
          onChange={handleSearchChange}
        />
      </div>
      <ul className="flex flex-col gap-1">
        <ScrollArea className="h-36">
          {filteredFriends().length !== 0 ? (
            filteredFriends().map((friend: FirebaseUser) => {
              return (
                <FriendLine
                  key={friend.uid}
                  friend={friend}
                  selected={selectedFriend?.uid === friend.uid}
                  onSelect={() => selectFriend(friend)}
                />
              );
            })
          ) : (
            <div>
              <p>Rien à afficher...</p>
            </div>
          )}
        </ScrollArea>
      </ul>
    </Card>
  );
};

export const FriendLine = ({
  friend,
  selected,
  onSelect,
}: {
  friend: FirebaseUser;
  selected: boolean | null;
  onSelect?: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-2 rounded cursor-pointer border border-transparent hover:bg-slate-200 ${
        selected ? "bg-slate-100" : ""
      }`}
      onClick={onSelect}
    >
      <Avatar className="h-9 w-9 flex">
        <AvatarImage
          src={friend.photoURL!}
          alt={`${friend.displayName}'s avatar`}
        />
        <AvatarFallback>
          {friend.displayName?.slice(0, 1) || "??"}
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none truncate">
          {friend.displayName}
        </p>
        <p className="text-sm text-muted-foreground truncate">{friend.email}</p>
      </div>
    </div>
  );
};
