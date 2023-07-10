import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }:
        { params: { billboardId: string } }
) {
    try {

        if (!params.billboardId) {
            return new NextResponse('billboard id is required', { status: 400 });
        }

        const billboard = await prismaDB.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch (e) {
        console.log('[BILLBOARD_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }:
        { params: { storeId: string, billboardId: string } }
) {

    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }

        if (!label) {
            return new NextResponse('label is required', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('image URL is required', { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse('billboard id is required', { status: 400 });
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

        const billboard = await prismaDB.billboard.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (e) {
        console.log('[BILLBOARD_PATCH]', e);
        return new NextResponse('internal error', { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }:
        { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }
        if (!params.billboardId) {
            return new NextResponse('billboard id is required', { status: 400 });
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

        const billboard = await prismaDB.billboard.deleteMany({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch (e) {
        console.log('[BILLBOARD_DELETE]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}