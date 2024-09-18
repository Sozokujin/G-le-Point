'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ToastDeletedAccount() {
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
