import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../stores/authStore";

const ModalMarker = ({ marker, setModalMarker }: any) => {
  const { user } = useAuthStore();

  console.log(user);

  const closeModal = () => {
    setModalMarker(null);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
      <XMarkIcon
        onClick={() => closeModal()}
        className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
      />
      <h1 className="text-xl font-bold">{marker.user.displayName}</h1>
      <p className="text-sm text-gray-500">
        Latitude: {marker.latitude}, Longitude: {marker.longitude}
      </p>
      <p className="text-sm text-gray-500">{marker.description}</p>
      {marker.user.uid === user?.uid ? (
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
          Passer le point en premium
        </button>
      ) : null}
    </div>
  );
};

export default ModalMarker;
