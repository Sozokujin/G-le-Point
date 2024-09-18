'use client';

import { ProfileCard } from '@/components/profile/profileCard';
import { StatsCard } from '@/components/profile/statsCard';

const Profile = () => {
    return (
        <div className="min-h-svh bg-muted p-2 sm:p-4 flex justify-center items-center w-full">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full max-w-7xl navbar-padding">
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
