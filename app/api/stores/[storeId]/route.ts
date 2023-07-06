import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }:
        {
            params:
            { storeId: string }
        }) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('store id requried', { status: 400 });
        }

        const store = await prismaDB.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (e) {
        console.log('[STORE_PATCH]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }:
        {
            params:
            { storeId: string }
        }) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('store id requried', { status: 400 });
        }

        const store = await prismaDB.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    } catch (e) {
        console.log('[STORE_DELETE]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}