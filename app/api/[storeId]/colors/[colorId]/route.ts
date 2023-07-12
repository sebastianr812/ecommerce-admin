import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }:
        { params: { colorId: string } }
) {
    try {

        if (!params.colorId) {
            return new NextResponse('color id is required', { status: 400 });
        }

        const color = await prismaDB.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);

    } catch (e) {
        console.log('[COLOR_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }:
        { params: { storeId: string, colorId: string } }
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

        if (!params.colorId) {
            return new NextResponse('color id is required', { status: 400 });
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

        const color = await prismaDB.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (e) {
        console.log('[COLOR_PATCH]', e);
        return new NextResponse('internal error', { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }:
        { params: { storeId: string, colorId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 });
        }
        if (!params.colorId) {
            return new NextResponse('color id is required', { status: 400 });
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

        const color = await prismaDB.color.deleteMany({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);

    } catch (e) {
        console.log('[COLOR_DELETE]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}