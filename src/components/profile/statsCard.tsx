'use client';

import { BorderBeam } from '@/components/magicui/border-beam';
import NumberTicker from '@/components/magicui/number-ticker';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { useEffect, useMemo } from 'react';
import CheckoutStripe from '../stripe/buttonProducts';

export const StatsCard = () => {
    const { currentUser } = useUserStore();
    const { userMarkers, getUserMarkers } = useMarkerStore();

    const userMarkersCount = useMemo(() => userMarkers?.length ?? 0, [userMarkers]);
    const userSuperMarkersCount = useMemo(() => currentUser?.superMarkers ?? 0, [currentUser]);
    const userScoreCount = useMemo(() => currentUser?.score ?? 0, [currentUser]);
    const products = [
        {
            name: '1 Super Point',
            priceId: 'price_1PuAYAP4rVLS4DImVQ2x3c25',
            price: '10',
            description: 'Acheter 1 Super Point'
        },
        {
            name: '5 Super Points',
            priceId: 'price_1Pv0OTP4rVLS4DIml24noZ3P',
            price: '40',
            description: 'Acheter 5 Super Points'
        }
    ];

    useEffect(() => {
        if (!currentUser) return;

        const loadMarkers = () => {
            getUserMarkers(currentUser.uid);
        };

        loadMarkers();
    }, [getUserMarkers, currentUser]);

    return (
        <div className="relative overflow-hidden w-full max-w-3xl flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                {products.map((product) => (
                    <div key={product.priceId} className="w-full sm:w-auto">
                        <CheckoutStripe priceId={product.priceId} price={product.price} description={product.description} />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full">
                <StatItem label="Nombre de points posés" value={userMarkersCount} icon="🗺️" />
                <StatItem label="Supers points restant" value={userSuperMarkersCount} icon="📍" />
                <StatItem label="Nombre de boussoles" value={userScoreCount} icon="🧭" />
                <StatItem label="Nombre de likes sur tes points" value={0} icon="❤️" todo />
            </div>
            <BorderBeam size={800} duration={12} delay={36} colorFrom="#9FCF6D" colorTo="#7CC772" />
        </div>
    );
};

interface StatItemProps {
    label: string;
    value: number;
    icon?: string;
    todo?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, todo = false }) => (
    <div className="text-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 text-green-700 flex flex-col items-center justify-center space-y-3 border border-green-100 select-none">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-lg font-medium">{label}</p>
        <span className="whitespace-pre-wrap text-3xl font-bold tracking-tighter">
            {todo ? <span className="text-gray-400">À venir</span> : value > 0 ? <NumberTicker value={value} /> : 0}
        </span>
    </div>
);
