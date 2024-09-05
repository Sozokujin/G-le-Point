/* eslint-disable react/no-unescaped-entities */
"use client";

import { ProfileCard } from "@/components/profile/profileCard";
import { StatsCard } from "@/components/profile/statsCard";

const Profile = () => {
  return (
    <div className="flex justify-center items-center flex-col mt-0 lg:mt-12 lg:mx-[25%]">
      <ProfileCard />
      <StatsCard />
    </div>
  );
};

export default Profile;
