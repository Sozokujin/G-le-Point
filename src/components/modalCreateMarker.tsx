import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { addMarkerGroup } from '@/services/firebase/markers';
import { useGroupStore } from '@/stores/groupStore';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GroupLine } from './friends/groups/groupList';
import AutocompleteMapbox from './map/autocompleteMapbox';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FirebaseUser, Group } from '@/types';
import { AvatarUser } from '@/components/ui/group-avatar';
import { manageScore } from '@/services/firebase/leaderboard';

const formSchema = z.object({
    visibility: z.enum(['public', 'friends', 'groups']),
    name: z.string().min(3, 'Le nom du lieu est requis et doit contenir au moins 3 caractères'),
    description: z.string().optional(),
    tag: z.string().default('Autre'),
    coordinates: z.string().optional()
});

const ModalCreateMarker = () => {
    const { currentUser, fetchUsersByIds, users } = useUserStore();
    const { addMarker } = useMarkerStore();
    const { groups, getGroups } = useGroupStore();

    const [display, setDisplay] = useState<'address' | 'gps' | 'position'>('position');
    const [addressCoordinates, setAddressCoordinates] = useState<number[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [groupMembers, setGroupMembers] = useState<{ [groupId: string]: AvatarUser[] }>({});
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visibility: 'public',
            name: '',
            description: '',
            tag: 'Autre',
            coordinates: ''
        }
    });
    const mapTags: string[] = [
        'Points de vue',
        'Randonnée et sentiers',
        'Espace vert',
        'Espace aquatique',
        'Espace de détente',
        'Site sportif',
        'Site touristique',
        'Site historique',
        'Site culturel',
        'Centre de loisirs',
        'Commerce',
        'Transport',
        'Restauration',
        'Bar',
        'Hôtel',
        'Camping',
        'Hébergement',
        'Service public',
        'Espace de santé',
        'Espace de travail',
        'Autre'
    ];

    useEffect(() => {
        if (groups.length === 0) {
            getGroups();
        }
    }, [form.watch('visibility')]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            const allMemberIds = groups.flatMap((group) => group.members);
            fetchUsersByIds(allMemberIds);

            const newGroupMembers: { [groupId: string]: AvatarUser[] } = {};
            groups.forEach((group) => {
                newGroupMembers[group.id] = group.members
                    .map((memberId) => users.find((user) => user.uid === memberId))
                    .filter((user): user is FirebaseUser => user !== undefined)
                    .map(convertToAvatarUser);
            });

            setGroupMembers(newGroupMembers);
        };

        if (groups.length > 0) {
            fetchGroupMembers();
        }
    }, [groups, fetchUsersByIds, users]);

    const convertToAvatarUser = (user: FirebaseUser): AvatarUser => ({
        id: user.uid,
        name: user.username || user.displayName || 'Sans nom',
        image: user.photoURL || undefined
    });

    const toggleGroupSelection = (group: any) => {
        setSelectedGroups((prevSelected) => {
            if (prevSelected.includes(group)) {
                return prevSelected.filter((selected) => selected !== group);
            } else {
                return [...prevSelected, group];
            }
        });
    };

    const addMarkerCommon = useCallback(
        (latitude: number, longitude: number, address = '') => {
            const idMarker = new Date().getTime().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

            if (!currentUser) return;
                const formValues = form.getValues();
                addMarker({
                    id: idMarker,
                    name: formValues.name,
                    description: formValues.description || '',
                    tags: formValues.tag,
                    address,
                    latitude,
                    longitude,
                    visibiltyStatus: formValues.visibility,
                    createdAt: Date.now(),
                    user: {
                        uid: currentUser.uid,
                        username: currentUser.username || currentUser.displayName || 'Sans nom',
                    },
                    likeCount: 0,
                    likedBy: [],
                    reportCount: 0,
                    reportedBy: []
                });

            if (selectedGroups.length > 0 && currentUser?.uid) {
                addMarkerGroup(idMarker, selectedGroups, currentUser.uid);
            }
            form.reset();
            setSelectedGroups([]);
            manageScore(currentUser.uid, 'marker_created', true);
            toast.success('Point ajouté avec succès');
            setIsDialogOpen(false);
        },
        [currentUser, form, addMarker, selectedGroups]
    );

    const addMarkerWithCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("La géolocalisation n'est pas disponible sur votre navigateur");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                addMarkerCommon(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                toast.error('Erreur lors de la récupération de la position: ' + error.message);
            }
        );
    };

    const addMarkerWithAddress = () => {
        if (addressCoordinates.length === 2) {
            addMarkerCommon(addressCoordinates[1], addressCoordinates[0], selectedAddress);
        } else {
            toast.error('Veuillez sélectionner une adresse valide');
        }
    };

    const addMarkerWithGps = (coordinates: string) => {
        const [latitude, longitude] = coordinates.split(',').map((coord) => parseFloat(coord.trim()));

        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            toast.error('Les coordonnées GPS sont invalides');
            return;
        }

        addMarkerCommon(latitude, longitude);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.visibility === 'groups' && selectedGroups.length === 0) {
            toast.error('Veuillez sélectionner au moins un groupe');
            return;
        }

        switch (display) {
            case 'position':
                addMarkerWithCurrentLocation();
                break;
            case 'address':
                addMarkerWithAddress();
                break;
            case 'gps':
                if (!values.coordinates) {
                    toast.error('Veuillez entrer des coordonnées GPS');
                    return;
                }
                addMarkerWithGps(values.coordinates);
                break;
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Link href="/map" className="block bg-glp-green p-2.5 sm:p-3 rounded-full">
                    <PlusIcon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-white" />
                </Link>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un point</DialogTitle>
                    <DialogDescription>Ajouter un point pour indiquer un lieu sur la carte</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibilité du point</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            if (value !== 'groups') {
                                                setSelectedGroups([]);
                                            }
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez la visibilité" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="friends">Amis</SelectItem>
                                            <SelectItem value="groups">Groupes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du lieu</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un tag" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mapTags.map((tag: string) => (
                                                <SelectItem key={tag} value={tag}>
                                                    {tag}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch('visibility') === 'groups' && (
                            <div>
                                <p className="mb-1">Partager le point avec vos groupes</p>
                                {groups.length === 0 ? (
                                    <p className="text-yellow-500 text-sm">
                                        Vous n&apos;avez pas encore de groupes. Veuillez en créer un d&apos;abord.
                                    </p>
                                ) : (
                                    <div className="overflow-y-auto max-h-28 flex flex-col gap-2">
                                        {groups.map((group) => (
                                            <GroupLine
                                                key={group.id}
                                                group={group}
                                                groupUsers={groupMembers[group.id] || []}
                                                selected={selectedGroups.includes(group)}
                                                onSelect={() => toggleGroupSelection(group)}
                                            />
                                        ))}
                                    </div>
                                )}
                                {groups.length > 0 && selectedGroups.length === 0 && (
                                    <p className="text-red-500 text-sm">Veuillez sélectionner au moins un groupe</p>
                                )}
                            </div>
                        )}

                        <div className="w-full h-8 flex flex-row border mb-4 text-xs">
                            {['address', 'gps', 'position'].map((mode) => (
                                <div
                                    key={mode}
                                    className={`h-full w-full flex items-center justify-center cursor-pointer ${
                                        display === mode ? 'outline outline-4 outline-offset-[-4px] outline-primary' : ''
                                    }`}
                                    onClick={() => setDisplay(mode as typeof display)}
                                >
                                    {mode === 'address' && 'Adresse'}
                                    {mode === 'gps' && 'Point GPS'}
                                    {mode === 'position' && 'Ma position'}
                                </div>
                            ))}
                        </div>

                        {display === 'address' && (
                            <AutocompleteMapbox
                                onAddressCoordinatesSelected={(coordinates, address) => {
                                    setAddressCoordinates(coordinates);
                                    setSelectedAddress(address);
                                }}
                            />
                    )}

                        {display === 'gps' && (
                            <FormField
                                control={form.control}
                                name="coordinates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Coordonnées GPS</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Exemple: 48.86127461, 2.334830083" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button type="submit" className="mt-4">
                            Enregistrer le point
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
export default ModalCreateMarker;
