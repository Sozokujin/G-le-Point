import useUserStore from "@/stores/userStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ModalMarker = ({ marker, setModalMarker }: any) => {
  const { user } = useUserStore();

  // Fonction pour fermer la modale si on clique sur le fond
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Si le clic provient du fond (backdrop) et non de la modale, on ferme la modale
    if (e.target === e.currentTarget) {
      setModalMarker(null);
    }
  };

  return (
    // Backdrop avec fond grisé
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      {/* Modale */}
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <XMarkIcon
          onClick={() => setModalMarker(null)}
          className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
        />
        <h1 className="text-xl font-bold">{marker.user.displayName}</h1>
        <p className="text-sm text-gray-500">
          Latitude: {marker.latitude}, Longitude: {marker.longitude}
        </p>
        <p className="text-sm text-gray-500">{marker.description}</p>
      </div>
    </div>
  );
};

export default ModalMarker;
