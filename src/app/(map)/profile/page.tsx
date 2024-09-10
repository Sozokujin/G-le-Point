"use client";

import { ProfileCard } from "@/components/profile/profileCard";
import { StatsCard } from "@/components/profile/statsCard";

const Profile = () => {
  return (
    <div className="flex justify-center items-center flex-col m-8 md:w-[768px] md:mx-auto">
      <ProfileCard />
      <StatsCard />
    </div>
  );
};

export default Profile;
