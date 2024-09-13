'use client';

import { ProfileCard } from '@/components/profile/profileCard';
import { StatsCard } from '@/components/profile/statsCard';

const Profile = () => {
    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-muted p-4 pb-28">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full max-w-7xl">
                <div className="w-full h-full flex justify-center">
                    <ProfileCard />
                </div>
                <div className="w-full h-full flex justify-center">
                    <StatsCard />
                </div>
            </div>
        </div>
    );
};

export default Profile;
