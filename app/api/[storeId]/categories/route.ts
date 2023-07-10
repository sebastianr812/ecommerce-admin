import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }:
        { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 })
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse('billboardId is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('store id is required', { status: 400 });
        }

        const storeByUserId = await prismaDB.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('unauthorized', { status: 403 });
        }

        const category = await prismaDB.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    } catch (e) {
        console.log('[CATEGORIES_POST]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }:
        { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse('store id is required', { status: 400 });
        }

        const categories = await prismaDB.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories);
    } catch (e) {
        console.log('[CATEGORIES_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}