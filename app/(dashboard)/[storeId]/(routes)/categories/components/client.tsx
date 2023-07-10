'use client';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface CateogryClientProps {
    data: CategoryColumn[];
}

const CategoryClient: React.FC<CateogryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${data.length})`}
                    description="Manage categories for your store" />

                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading
                title="API"
                description="API calls for Categories" />
            <Separator />
            <ApiList
                entityIdName="categoryId"
                entityName="categories" />
        </>
    );
}

export default CategoryClient;