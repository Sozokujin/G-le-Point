import React from 'react';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';

interface FilterProps {
    showFriends: boolean;
    setShowFriends: (value: boolean) => void;
    showGroups: boolean;
    setShowGroups: (value: boolean) => void;
    showPublic: boolean;
    setShowPublic: (value: boolean) => void;
    satelliteMap: boolean;
    setSatelliteMap: (value: boolean) => void;
}

const Filter = ({
    showFriends,
    setShowFriends,
    showGroups,
    setShowGroups,
    showPublic,
    setShowPublic,
    satelliteMap,
    setSatelliteMap
}: FilterProps) => {
    return (
        <div className="absolute top-2 left-12 flex flex-row bg-white p-2 rounded-md z-10 gap-4">
            <Switch id="showPublic" checked={showPublic} onCheckedChange={() => setShowPublic(!showPublic)} />
            <Switch
                id="showFriends"
                checked={showFriends}
                onCheckedChange={() => setShowFriends(!showFriends)}
                className="data-[state=checked]:bg-[#6C63FF] data-[state=unchecked]:bg-input"
            />
            <Switch
                id="showGroups"
                checked={showGroups}
                onCheckedChange={() => setShowGroups(!showGroups)}
                className="data-[state=checked]:bg-[#FF6584] data-[state=unchecked]:bg-input"
            />
            <Switch
                id="satelliteMap"
                checked={satelliteMap}
                onCheckedChange={() => setSatelliteMap(!satelliteMap)}
                className="data-[state=checked]:bg-[#FF6584] data-[state=unchecked]:bg-input"
            />
            <Popover>
                <PopoverTrigger>
                    <Badge className="cursor-pointer">?</Badge>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <div>
                        <ol>
                            <li className="text-glp-green">Points publics</li>
                            <li className="text-[#6C63FF]">Points des amis</li>
                            <li className="text-[#FF6584]">Points des groupes</li>
                        </ol>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Filter;
