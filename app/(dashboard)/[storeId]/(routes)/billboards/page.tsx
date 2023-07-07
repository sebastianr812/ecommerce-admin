import BillboardClient from "./components/client";

const BillboardsPage = () => {
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardClient />
            </div>
        </div>
    );
}

export default BillboardsPage;