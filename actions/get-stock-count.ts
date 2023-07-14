import prismaDB from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
    const stockCount = await prismaDB.product.count({
        where: {
            storeId,
            isArchived: false
        }
    });

    return stockCount;
}