import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AutocompleteMapboxProps {
    onAddressCoordinatesSelected: (coordinates: number[], address: string) => void;
}

const AutocompleteMapbox = ({ onAddressCoordinatesSelected }: AutocompleteMapboxProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userPosition, setUserPosition] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const autompleteRef = useRef<HTMLInputElement>(null);

    const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

    useEffect(() => {
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        setUserPosition({ latitude: 45.75009, longitude: 4.82323 });
                        toast.info("La géolocalisation n'est pas disponible");
                        console.error('Erreur de géolocalisation:', error);
                    }
                );
            }
        };

        getCurrentLocation();
    }, []);

    useEffect(() => {
        const searchAddress = async () => {
            if (query.length < 3 || !userPosition) return;

            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        query
                    )}.json?proximity=${userPosition.longitude},${
                        userPosition.latitude
                    }&autocomplete=true&limit=5&access_token=${mapboxAccessToken}`
                );
                const data = await response.json();
                setResults(data.features);
                setIsSuggestionsVisible(true); // Afficher les suggestions
            } catch (error) {
                console.error("Erreur de recherche d'adresse:", error);
            }
        };

        searchAddress();
    }, [query, userPosition]);

    const handleSelectAddress = (address: {
        place_name: SetStateAction<string>;
        geometry: { coordinates: number[] | SetStateAction<null> };
    }) => {
        setSelectedAddress(address.place_name);
        if (Array.isArray(address.geometry.coordinates)) {
            onAddressCoordinatesSelected(address.geometry.coordinates, address.place_name as string);
        } else {
            console.error('Invalid coordinates:', address.geometry.coordinates);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (autompleteRef.current && !autompleteRef.current.contains(event.target as Node)) {
            setIsSuggestionsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Input
                type="text"
                value={selectedAddress || query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedAddress('');
                    setIsSuggestionsVisible(true);
                }}
                placeholder="Entrez une adresse"
                ref={autompleteRef}
            />
            {isSuggestionsVisible && results.length > 0 && (
                <div className="border max-h-[200px] w-3/4 overflow-y-auto absolute bg-white z-1">
                    {results.map((result: any) => (
                        <div
                            key={result.id}
                            className="p-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelectAddress(result)}
                        >
                            {result.place_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteMapbox;
