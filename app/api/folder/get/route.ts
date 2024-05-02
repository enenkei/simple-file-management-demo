import { prisma } from "@/db/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    try {
        const user = getAuth(req);
        if (!user || !user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = req.nextUrl.searchParams.get("userId");
        if(userId && userId === user.userId) {
            const folders = await prisma.folders.findMany({
                where : {
                    userId
                },
                orderBy : {
                    createdAt : 'desc'
                },
                include : {
                    files : true
                }
            });
            if(folders) {
                return NextResponse.json({folders}, {status : 200});
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something happened' }, { status: 500 })
    }
    return NextResponse.json({ message: 'No action taken' }, { status: 200 });
}