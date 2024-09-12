'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

type SessionData = {
    amount_total: number;
    currency: string;
    payment_status: string;
    line_items: {
        description: string;
        price: {
            unit_amount: number;
        };
        quantity: number;
    }[];
};

const Checkout = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSessionData = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/get-session-details?session_id=${sessionId}`);
            const data = await response.json();
            setSessionData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching session data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            fetchSessionData(sessionId);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-[100svh] flex justify-center items-center">
                <BeatLoader color="#37b978" />
            </div>
        );
    }

    if (!sessionData || sessionData.payment_status !== 'paid') {
        return (
            <div className="min-h-[100svh] flex flex-col justify-center items-center container p-6">
                <div className="relative mx-auto w-52 h-52 md:w-96 md:h-96 mb-4">
                    <Image src={'/images/order_error.svg'} fill={true} alt="" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Erreur lors du paiement</h1>
                <p>
                    Le paiement a échoué. Veuillez-nous nous contacter par mail :{' '}
                    <a href="mailto:team.glepoint@gmail.com" className="underline">
                        team.glepoint@gmail.com
                    </a>{' '}
                    pour plus d&apos;informations.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-muted flex flex-col justify-center items-center pb-12">
            <div className="bg-white rounded-xl max-w-4xl p-4 md:p-6 pb-12 mx-4 lg:mx-0">
                <div className="max-w-xl relative mx-auto w-24 h-24 md:w-32 md:h-32 ">
                    <Image src={'/images/order_success.svg'} fill={true} alt="" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Merci pour votre achat !</h1>
                <div className="w-full bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-sm md:text-lg font-semibold mb-2 md:mb-4">Détails de votre commande :</h2>
                    {sessionData.line_items.map((item, index) => (
                        <div key={index} className="mb-4">
                            <p>{item.description}</p>
                            <p>Quantité : {item.quantity}</p>
                            <p>
                                Prix unitaire : {(item.price.unit_amount / 100).toFixed(2)} {sessionData.currency.toUpperCase()}
                            </p>
                        </div>
                    ))}

                    <div className="mt-2 md:mt-6">
                        <p className="text-sm md:text-lg font-bold">
                            Total payé : {(sessionData.amount_total / 100).toFixed(2)} {sessionData.currency.toUpperCase()}
                        </p>
                        <p>Statut du paiement : Réussi</p>
                    </div>
                </div>

                <div className="text-center mt-2 md:mt-6 ">
                    <p className="text-slate-700 text-sm font-medium mb-4">
                        Nous vous remercions pour votre achat. Si vous avez des questions, n&apos;hésitez pas à nous contacter par
                        mail :{' '}
                        <a href="mailto:team.glepoint@gmail.com" className="underline hover:text-slate-900">
                            team.glepoint@gmail.com
                        </a>
                        .
                    </p>
                    <Link className="text-slate-700 hover:text-slate-900 underline" href="/map">
                        Revenir sur la carte
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
