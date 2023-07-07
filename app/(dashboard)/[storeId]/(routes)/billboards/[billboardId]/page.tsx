import prismaDB from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form.tsx";

const BillboardPage = async ({ params }:
    {
        params:
        { billboardId: string }
    }) => {

    const billboard = await prismaDB.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardForm initalData={billboard} />
            </div>
        </div>
    );
}

export default BillboardPage;