import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismaDB.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <div>
            hello setting page!
        </div>
    );
}

export default SettingsPage;