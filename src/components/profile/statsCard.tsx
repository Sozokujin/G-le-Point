'use client';

import { BorderBeam } from '@/components/magicui/border-beam';
import NumberTicker from '@/components/magicui/number-ticker';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { useEffect } from 'react';
import CheckoutStripe from '../stripe/buttonProducts';

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

export const StatsCard = () => {
    const markers = useMarkerStore((state) => state.userMarkers);
    const getUserMarkers = useMarkerStore((state) => state.getUserMarkers);
    const { currentUser } = useUserStore();

    useEffect(() => {
        if (currentUser) {
            const loadMarkers = async () => {
                await getUserMarkers(currentUser.uid);
            };

            loadMarkers();
        }
    }, [getUserMarkers, currentUser]);

    /**
     * TODO: Add the SuperMarkers to the user store
     */

    return (
        <div className="relative overflow-hidden mb-20 md:mb-28 mt-12 w-full flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2>Statistiques</h2>
            <div className=" flex flex-row justify-center items-center gap-6">
                {products.map((product) => (
                    <CheckoutStripe
                        key={product.priceId}
                        priceId={product.priceId}
                        price={product.price}
                        description={product.description}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 gap-4 mt-8">
                <div className="text-center lg:h-24">
                    <p className="text-lg">Nombre de points posés</p>
                    <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
                        {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
                    </span>
                </div>
                <div className="text-center lg:h-24">
                    <p className="text-lg">Supers points restant</p>
                    <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
                        {currentUser && currentUser.superMarkers !== 0 ? <NumberTicker value={currentUser.superMarkers} /> : 0}
                    </span>
                </div>
                <div className="text-center lg:h-24">
                    <p className="text-lg">Nombre de boussoles // TODO</p>
                    <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">0 // TO DO</span>
                </div>
                <div className="text-center lg:h-24">
                    <p className="text-lg">Nombre de likes sur tes points // TODO</p>
                    <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">0 // TO DO</span>
                </div>
            </div>
            <BorderBeam size={800} duration={12} delay={36} colorFrom="#9FCF6D" colorTo="#7CC772" />
        </div>
    );
};
