'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
    name: z.string().min(1, {
        message: 'Veuillez entrer un prénom.'
    }),
    surname: z.string().min(1, {
        message: 'Veuillez entrer un nom.'
    }),
    email: z.string().email({
        message: "L'adresse e-mail n'est pas valide."
    }),
    message: z
        .string()
        .min(1, {
            message: 'Vous devez entrer un message.'
        })
        .max(500, {
            message: 'Votre message ne peut pas dépasser 500 caractères.'
        })
});

const Contact = () => {
    const sendBtnRef = useRef<HTMLButtonElement | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            message: ''
        }
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        sendBtnRef.current!.disabled = true;
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            form.reset();
            form.clearErrors();
            toast('Votre message a bien été envoyé.');
            sendBtnRef.current!.disabled = false;
        } else {
            const error = await response.json();
            console.error(error);
            toast.error("Une erreur s'est produite lors de l'envoi du message.");
            sendBtnRef.current!.disabled = false;
        }
    }

    useEffect(() => {
        form.reset({
            name: '',
            surname: '',
            email: '',
            message: ''
        });
    }, [form]);

    return (
        <div className="mx-auto flex flex-col justify-center items-center max-w-5xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nous contacter</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-2/3 space-y-6 p-4">
                    <div className="flex flex-row w-full gap-4">
                        <FormField
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Prénom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="surname"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="exemple@exemple.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Il s&apos;agit de l'adresse mail à laquelle nous vous recontacterons.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Votre message</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-center items-center">
                        <Button
                            ref={sendBtnRef}
                            type="submit"
                            className="w-64 text-center cursor-pointer flex justify-center items-center rounded-lg text-white bg-primary px-4 py-2"
                        >
                            Envoyer
                        </Button>
                    </div>
                </form>
            </Form>
            <Toaster position="top-right" />
        </div>
    );
};

export default Contact;
