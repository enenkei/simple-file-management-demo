import { prisma } from "@/db/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = getAuth(req);
        if (!user || !user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = req.nextUrl.searchParams.get("userId");
        if (userId && userId === user.userId) {
            const query = req.nextUrl.searchParams.get("query");
            if (query) {
                const files = await prisma.files.findMany({
                    where: {
                        userId,
                        name : {
                            endsWith : query
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                if (files) {
                    return NextResponse.json({ files }, { status: 200 });
                }
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something happened' }, { status: 500 })
    }
    return NextResponse.json({ message: 'No action taken' }, { status: 200 });
}