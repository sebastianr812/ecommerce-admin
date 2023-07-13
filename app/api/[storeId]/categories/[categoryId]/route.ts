import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }:
        { params: { categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse('category id is required', { status: 400 });
        }

        const category = await prismaDB.category.findUnique({
            where: {
                id: params.categoryId
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);

    } catch (e) {
        console.log('[CATEGORY_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }:
        { params: { storeId: string, categoryId: string } }
) {

    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse('billboardId is required', { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse('category id is required', { status: 400 });
        }

        const storeByUserId = await prismaDB.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('unauthorized', { status: 403 })
        }

        const category = await prismaDB.category.updateMany({
            where: {
                id: params.categoryId
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);

    } catch (e) {
        console.log('[CATEGORY_PATCH]', e);
        return new NextResponse('internal error', { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }:
        { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }
        if (!params.categoryId) {
            return new NextResponse('category id is required', { status: 400 });
        }

        const storeByUserId = await prismaDB.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('unauthorized', { status: 403 })
        }

        const category = await prismaDB.category.deleteMany({
            where: {
                id: params.categoryId
            }
        });

        return NextResponse.json(category);

    } catch (e) {
        console.log('[CATEGORY_DELETE]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}