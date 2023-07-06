import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismaDB from "@/lib/prismadb";
import { redirect } from "next/navigation";

const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const stores = await prismaDB.store.findMany({
        where: {
            userId
        }
    });
    return (
        <div className="border-b ">
            <div className="flex items-center h-16 px-4">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6" />
                <div className="flex items-center ml-auto space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>

            </div>

        </div>
    );
}

export default Navbar;