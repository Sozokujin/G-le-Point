import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { BorderBeam } from '@/components/magicui/border-beam';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/services/firebase/config';
import { deleteAccount, updateUser } from '@/services/firebase/profil';
import useUserStore from '@/stores/userStore';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { TrashIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid';
import { clearAllStores } from '@/stores/clearStores';

const FormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Le nom d'utilisateur doit comporter au moins 2 caractères."
        })
        .max(50, { message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères." }),
    bio: z.string().optional()
});

export const ProfileCard = () => {
    const router = useRouter();
    const { currentUser, clearCurrentUser } = useUserStore();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: currentUser?.username || currentUser?.displayName || '',
            bio: currentUser?.bio || ''
        }
    });

    const isFormUnchanged = form.watch('username') === currentUser?.username && form.watch('bio') === currentUser?.bio;

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!currentUser) return;

        if (data.username) currentUser.username = data.username;
        currentUser.bio = data.bio ?? null;

        try {
            await updateUser(currentUser);
            toast.success('Vous avez mis à jour votre profil avec succès.');
        } catch (error) {
            toast.error("Une erreur s'est produite lors de la mise à jour de votre profil.");
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearAllStores();
            await fetch('/api/logout');
            router.push('/');
        } catch (error) {
            toast.error("Une erreur s'est produite lors de la déconnexion.");
        }
    };

    const handleDelete = async () => {
        if (currentUser) {
            try {
                await deleteAccount();
                toast.success('Votre compte a été supprimé avec succès.');
            } catch (error) {
                toast.error("Une erreur s'est produite lors de la suppression du compte.");
            }
        }
    };

    React.useEffect(() => {
        if (currentUser) {
            form.reset({
                username: currentUser.username || currentUser.displayName || '',
                bio: currentUser.bio || ''
            });
        }
    }, [currentUser, form]);

    return (
        <div className="relative overflow-hidden w-full max-w-3xl flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6">
            <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser?.photoURL ?? ''} alt={currentUser?.username ?? ''} />
                <AvatarFallback>{currentUser?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl mb-6">Mon compte</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-0 sm:px-24 space-y-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <FormField
                                        name="email"
                                        disabled
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={currentUser?.email ?? ''} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Vous ne pouvez pas modifier votre e-mail.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom d'utilisateur" {...field} />
                                </FormControl>
                                <FormDescription>Il s&apos;agit de votre nom d&apos;affichage public.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Biographie</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="resize-none"
                                        placeholder="Amoureux(se) de découvertes, je partage ici mes lieux secrets et pépites cachées pour les passionnés d'exploration."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-center items-center">
                        <Button type="submit" className="w-full sm:w-64 rounded-full" disabled={isFormUnchanged}>
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="flex flex-col sm:flex-row justify-center items-center w-full mt-6 gap-4">
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full sm:w-auto bg-slate-500 text-white hover:bg-slate-600 p-4 rounded-full"
                >
                    <ArrowLeftStartOnRectangleIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">Se déconnecter</span>
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger className="w-full sm:w-auto bg-destructive text-white hover:bg-red-600 p-4 rounded-full flex justify-center items-center h-10">
                        <TrashIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">Supprimer le compte</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Etes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte et supprimera
                                vos données de nos serveurs.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-white hover:bg-red-600" onClick={handleDelete}>
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <BorderBeam size={800} duration={12} delay={18} colorFrom="#9FCF6D" colorTo="#7CC772" />
        </div>
    );
};
