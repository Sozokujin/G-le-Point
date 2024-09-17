import React, { useEffect } from 'react';
import { FirebaseUser } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { BookOpen, Compass, MapPin } from 'lucide-react';
import NumberTicker from './magicui/number-ticker';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import useMarkerStore from '@/stores/markerStore';

interface ModalSeeProfileProps {
    user: FirebaseUser;
    trigger: React.ReactNode;
}

const ModalSeeProfile = ({ user, trigger }: ModalSeeProfileProps) => {
    const { userMarkers, getUserMarkers } = useMarkerStore();

    useEffect(() => {
        getUserMarkers(user.uid);
    }, [user.uid, getUserMarkers]);

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <VisuallyHidden.Root>
                <DialogTitle />
            </VisuallyHidden.Root>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg">
                <Card className="w-full border-none shadow-none">
                    <div className="relative h-40 bg-gradient-to-r from-emerald-500 to-teal-500">
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                <AvatarImage src={user.photoURL || ''} alt={user.username || ''} />
                                <AvatarFallback className="text-4xl font-bold bg-emerald-200 text-emerald-700">
                                    {user.username?.charAt(0) || user.email?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
                            {user.username || user.displayName || 'Sans nom'}
                        </h2>
                        <p className="text-center text-gray-600 mb-6">{user.email}</p>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <ProfileItem
                                icon={<BookOpen className="h-6 w-6" />}
                                label="Bio"
                                value={user.bio}
                                color="from-pink-500 to-rose-500"
                                fullWidth
                            />
                            <ProfileItem
                                icon={<Compass className="h-6 w-6" />}
                                label="Boussoles"
                                value={user.score || 0}
                                color="from-yellow-500 to-orange-500"
                            />
                            <ProfileItem
                                icon={<MapPin className="h-6 w-6" />}
                                label="Points posés"
                                value={userMarkers.length || 0}
                                color="from-purple-500 to-indigo-500"
                            />
                        </div>
                    </div>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

interface ProfileItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    color: string;
    fullWidth?: boolean;
}

const ProfileItem = ({ icon, label, value, color, fullWidth = false }: ProfileItemProps) => (
    <div className={`group overflow-hidden w-full h-full ${fullWidth ? 'col-span-2' : ''}`}>
        <div
            className={`flex w-full h-full items-center space-x-4 p-4 rounded-xl bg-white shadow-lg
                       transition-all duration-300 ease-in-out
                       bg-gradient-to-r ${color}`}
        >
            <div className="bg-white p-3 rounded-full transform transition-transform duration-300 group-hover:rotate-12">
                {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${color}` })}
            </div>
            <div className="flex-grow select-none">
                <h4 className="font-semibold text-white text-lg mb-1">{label}</h4>
                {typeof value === 'number' ? (
                    value > 0 ? (
                        <NumberTicker className="text-white line-clamp-2" value={value} />
                    ) : (
                        <p className="text-white line-clamp-2">0</p>
                    )
                ) : (
                    <p className="text-white line-clamp-2">{value || 'Non fourni'}</p>
                )}
            </div>
        </div>
    </div>
);

export default ModalSeeProfile;
