'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: BillboardColumn;
}

const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Billboard id copied to clipboard');
    }


    const onDelete = async () => {
        try {
            setLoading(true);

            axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            toast.success('Billboard deleted');
        } catch (e) {
            toast.error('Make sure you removed all categories using this billboard first');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AlertModal
                onConfirm={onDelete}
                isOpen={open}
                onClose={() => setOpen(false)}
                loading={loading} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-8 h-8 p-0" variant='ghost'>
                        <span className="sr-only">Open manu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Id
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default CellAction;