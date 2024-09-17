import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import CheckoutStripe from '@/components/stripe/buttonProducts';
import { Switch } from '@/components/ui/switch';

interface ModalActionsProps {
    filters: { showFriends: boolean; showGroups: boolean; showPublic: boolean; satelliteMap: boolean };
    setFilters: (value: { showFriends: boolean; showGroups: boolean; showPublic: boolean; satelliteMap: boolean }) => void;
    setModalListMarkers: (value: boolean) => void;
}

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

export default function ModalActions({ filters, setFilters, setModalListMarkers }: ModalActionsProps) {
    const { showFriends, showGroups, showPublic, satelliteMap } = filters;

    const setShowFriends = (value: boolean) => setFilters({ ...filters, showFriends: value });
    const setShowGroups = (value: boolean) => setFilters({ ...filters, showGroups: value });
    const setShowPublic = (value: boolean) => setFilters({ ...filters, showPublic: value });
    const setSatelliteMap = (value: boolean) => setFilters({ ...filters, satelliteMap: value });

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="p-2 bg-glp-green shadow-md rounded-full">
                <Cog6ToothIcon aria-hidden="true" className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-svw max-w-72 origin-top-right divide-y p-3 divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <h3 className="mt-0 text-center">Options</h3>
                <div className="py-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Switch id="showPublic" checked={showPublic} onCheckedChange={() => setShowPublic(!showPublic)} />
                        <span>Points public</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="showFriends"
                            checked={showFriends}
                            onCheckedChange={() => setShowFriends(!showFriends)}
                            className="data-[state=checked]:bg-[#6C63FF] data-[state=unchecked]:bg-input"
                        />
                        <span>Points des amis</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="showGroups"
                            checked={showGroups}
                            onCheckedChange={() => setShowGroups(!showGroups)}
                            className="data-[state=checked]:bg-[#FF6584] data-[state=unchecked]:bg-input"
                        />
                        <span>Points des groupes</span>
                    </div>
                </div>
                <div className="py-3 flex items-center gap-2">
                    <Switch id="satelliteMap" checked={satelliteMap} onCheckedChange={() => setSatelliteMap(!satelliteMap)} />
                    <span>Vue satellite</span>
                </div>
                <div className="py-3">
                    <MenuItem>
                        <button onClick={() => setModalListMarkers(true)} className="hover:text-glp-green">
                            Voir mes points
                        </button>
                    </MenuItem>
                </div>
                <div className="pt-3">
                    <h4 className="mt-0 text-center">Premium</h4>
                    <div className="flex flex-col gap-2">
                        {products.map((product) => (
                            <CheckoutStripe
                                key={product.priceId}
                                priceId={product.priceId}
                                price={product.price}
                                description={product.description}
                            />
                        ))}
                    </div>
                </div>
            </MenuItems>
        </Menu>
    );
}
