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
        const { name, value } = body;

        if (!userId) {
            return new NextResponse('unauthenticated', { status: 401 })
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('value is required', { status: 400 });
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

        const color = await prismaDB.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);

    } catch (e) {
        console.log('[COLORS_POST]', e);
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

        const colors = await prismaDB.color.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(colors);
    } catch (e) {
        console.log('[COLORS_GET]', e);
        return new NextResponse('internal error', { status: 500 });
    }
}