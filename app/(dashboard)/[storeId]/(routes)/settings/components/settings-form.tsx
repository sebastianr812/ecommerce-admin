'use client';

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from 'zod';

interface SettingsFormProps {
    initalData: Store;
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({
    initalData
}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const router = useRouter();


    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initalData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);

            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success('Name of the store was updated');

        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            axios.delete(`/api/stores/${params.storeId}`);
        } catch (e) {
            toast.error('Make sure you removed all products and categories first');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => { }}
                loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title='Settings'
                    description='Manage store preferences' />
                <Button
                    disabled={loading}
                    variant='destructive'
                    size='icon'
                    onClick={() => setOpen(true)}>
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Store name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>

                </form>
            </Form>
        </>
    );
}

export default SettingsForm;