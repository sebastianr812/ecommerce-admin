import { format } from 'date-fns';
import prismaDB from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";
import ColorClient from './components/client';

const ColorsPage = async ({ params }:
    { params: { storeId: string } }) => {

    const colors = await prismaDB.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formttedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorClient data={formttedColors} />
            </div>
        </div>
    );
}

export default ColorsPage;