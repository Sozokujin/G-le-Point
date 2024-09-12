import { useState, useEffect } from 'react';

interface UseIsMobile {
    isMobile: boolean | null;
    isPending: boolean;
}

export const useIsMobile = (): UseIsMobile => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {
        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        const mediaQuery = window.matchMedia('(max-width: 640px)');
        setIsMobile(mediaQuery.matches);
        setIsPending(false);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    return { isMobile, isPending };
};
