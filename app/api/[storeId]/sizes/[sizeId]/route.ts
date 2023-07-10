import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }:
        { params: { sizeId: string } }
) {
    try {

        if (!params.sizeId) {
            return new NextResponse('size id is required', { status: 400 });
        }

        const size = await prismaDB.size.findUnique({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size);

    } catch (e) {
        console.log('[SIZE_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }:
        { params: { storeId: string, sizeId: string } }
) {

    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('value is required', { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse('size id is required', { status: 400 });
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

        const size = await prismaDB.size.updateMany({
            where: {
                id: params.sizeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);

    } catch (e) {
        console.log('[SIZE_PATCH]', e);
        return new NextResponse('internal error', { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }:
        { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }
        if (!params.sizeId) {
            return new NextResponse('size id is required', { status: 400 });
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

        const size = await prismaDB.size.deleteMany({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size);

    } catch (e) {
        console.log('[SIZE_DELETE]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}