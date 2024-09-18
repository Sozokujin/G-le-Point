import Navbar from '@/components/navbar';
import CheckAuth from '@/lib/checkAuth';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Navbar />
            <CheckAuth />
        </>
    );
}
