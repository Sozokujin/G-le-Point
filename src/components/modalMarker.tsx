import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/userStore";

const ModalMarker = ({ marker, setModalMarker }: any) => {
  const { user } = useUserStore();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
      <XMarkIcon
        onClick={() => setModalMarker(null)}
        className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
      />
      <h1 className="text-xl font-bold">{marker.user.displayName}</h1>
      <p className="text-sm text-gray-500">
        Latitude: {marker.latitude}, Longitude: {marker.longitude}
      </p>
      <p className="text-sm text-gray-500">{marker.description}</p>
      {marker.user.uid === user?.uid && (
        <Button className="bg-primary text-white px-4 py-2 rounded-lg mt-2">
          Passer le point en premium
        </Button>
      )}
    </div>
  );
};

export default ModalMarker;
