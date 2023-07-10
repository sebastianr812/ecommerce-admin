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
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 })
        }

        if (!label) {
            return new NextResponse('label is required', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('imageUrl is required', { status: 400 });
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

        const billboard = await prismaDB.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (e) {
        console.log('[BILLBOARDS_POST]', e);
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

        const billboards = await prismaDB.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);
    } catch (e) {
        console.log('[BILLBOARDS_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}