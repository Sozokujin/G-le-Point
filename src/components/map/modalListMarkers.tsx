import { useIsMobile } from '@/utils/isMobile';
import useMarkerStore from '@/stores/markerStore';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { MarkersList } from '@/components/marker/markersList';

interface ModalListMarkersProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function ModalListMarkers({ open, setOpen }: ModalListMarkersProps) {
    const { isMobile } = useIsMobile();
    const { userMarkers } = useMarkerStore();

    return isMobile ? (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <DrawerContent>
                <DrawerTitle className="text-xl text-center font-bold mb-0">Tous vos points</DrawerTitle>
                {/* DO NOT REMOVE VisuallyHidden, NEEDED FOR SCREEN READER */}
                <VisuallyHidden.Root>
                    <DrawerDescription>List of your markers</DrawerDescription>
                </VisuallyHidden.Root>
                <MarkersList markers={userMarkers} allowDelete={true} />
            </DrawerContent>
        </Drawer>
    ) : (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogTitle className="text-xl text-center font-bold">Tous vos points</DialogTitle>
                {/* DO NOT REMOVE VisuallyHidden, NEEDED FOR SCREEN READER */}
                <VisuallyHidden.Root>
                    <DialogDescription>List of your markers</DialogDescription>
                </VisuallyHidden.Root>
                <MarkersList markers={userMarkers} forceMobileDisplay={true} allowDelete={true} className="!p-0" />
            </DialogContent>
        </Dialog>
    );
}
