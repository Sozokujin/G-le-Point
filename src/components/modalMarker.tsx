import { addLike, removeLike } from "@/services/firebase/markers";
import useUserStore from "@/stores/userStore";
import { HandThumbUpIcon } from "@heroicons/react/20/solid";
import {
  HandThumbUpIcon as HandThumbUpIconOutline,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

const ModalMarker = ({ marker, setModalMarker }: any) => {
  const { user } = useUserStore();

  const [likeCount, setLikeCount] = useState(marker.likeCount || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (marker.likedBy && marker.likedBy.includes(user?.uid)) {
      setLiked(true);
    }
  }, [marker.likedBy, user]);

  const handleLike = () => {
    if (!liked) {
      addLike(marker.id, user?.uid ?? "");
      setLikeCount(likeCount + 1);
      setLiked(true);
    } else {
      removeLike(marker.id, user?.uid ?? "");
      setLikeCount(likeCount - 1);
      setLiked(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && setModalMarker(null)}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-3/4 md:max-w-[500px]">
        <XMarkIcon
          onClick={() => setModalMarker(null)}
          className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
        />
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            <Badge className="text-xl font-bold">{marker.name}</Badge>
            <Badge className="text-xl">{marker.user.username}</Badge>
          </div>
          <div>PHOTO</div>
        </div>
        <Textarea
          className="w-full h-56 resize-none mt-6 focus-visible:ring-0"
          value={marker.description}
          readOnly
        />
        <div className="flex gap-2 mt-4 justify-between">
          <Badge className="text-md">{marker.tags}</Badge>
          <Badge
            onClick={handleLike}
            className={`text-md bg-white border-glp-green cursor-pointer`}
          >
            {liked ? (
              <HandThumbUpIcon className="h-6 w-6 text-glp-green" />
            ) : (
              <HandThumbUpIconOutline className="h-6 w-6 text-glp-green" />
            )}
            <span className="text-glp-green ml-2">{likeCount}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ModalMarker;
