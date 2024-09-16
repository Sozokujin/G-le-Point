'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

function ToastDeletedAccountComponent() {
    const params = useSearchParams();

    useEffect(() => {
        if (params.get('account') === 'deleted') {
            // use setTimeout to avoid double rendering
            const timer = setTimeout(() => {
                toast.success('Votre compte a été supprimé avec succès.');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [params]);

    return null;
}

export default function ToastDeletedAccount() {
    return (
        <Suspense fallback={null}>
            <ToastDeletedAccountComponent />
        </Suspense>
    );
}
