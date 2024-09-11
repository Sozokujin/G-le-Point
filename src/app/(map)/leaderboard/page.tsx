'use client';
import LeaderboardBanners from '@/components/leaderboard/leaderboardBanner';
import LeaderboardList from '@/components/leaderboard/leaderboardList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useUserStore from '@/stores/userStore';
import { FirebaseUser } from '@/types';
import { useEffect, useState } from 'react';
import BarLoader from 'react-spinners/BarLoader';

const Leaderboard = () => {
    const [loading, setLoading] = useState(true);
    const { currentUser, topUsersByScore, fetchUserByScores, topFriendsUsersByScore, fetchFriendsUserByScores } = useUserStore();

    useEffect(() => {
        const loadUsers = async () => {
            await fetchUserByScores();
            if (currentUser) {
                await fetchFriendsUserByScores(currentUser.uid);
            }
            setLoading(false);
        };

        loadUsers();
    }, [fetchUserByScores, fetchFriendsUserByScores, currentUser]);

    const topUsers: FirebaseUser[] = topUsersByScore.slice(0, 3);
    const otherUsers: FirebaseUser[] = topUsersByScore.slice(3);

    const topFriends: FirebaseUser[] = topFriendsUsersByScore.slice(0, 3);
    const otherFriends: FirebaseUser[] = topFriendsUsersByScore.slice(3);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <BarLoader color="#37b978" />
            </div>
        );
    }

    return (
        <section className="w-full h-[calc(100%-86px)] flex justify-center p-4">
            <Tabs defaultValue="global" className="w-[1000px] h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="global">Globale</TabsTrigger>
                    <TabsTrigger value="friends">Amis</TabsTrigger>
                </TabsList>
                <TabsContent value="global" className="flex-grow overflow-hidden">
                    <Card className="flex flex-col h-full">
                        <CardContent className="space-y-2 flex-grow overflow-hidden flex flex-col">
                            <CardHeader>
                                <h2 className="text-center mb-4">Classement Global</h2>
                            </CardHeader>
                            <LeaderboardBanners players={topUsers} />
                            <LeaderboardList players={otherUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="friends" className="flex-grow overflow-hidden">
                    <Card className="flex flex-col h-full">
                        <CardContent className="space-y-2 flex-grow overflow-hidden flex flex-col">
                            <CardHeader>
                                <h2 className="text-center mb-4">Classement Amis</h2>
                            </CardHeader>
                            <LeaderboardBanners players={topFriends} />
                            <LeaderboardList players={otherFriends} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default Leaderboard;
