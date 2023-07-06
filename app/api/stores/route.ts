import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return new NextResponse('name is required', { status: 400 });
        }

        const store = await prismaDB.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store);


    } catch (e) {
        console.log(`[STORES_POST]`, e);
        return new NextResponse('internal error', { status: 500 });
    }
}