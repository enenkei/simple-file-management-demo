import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/db/db';

export async function POST(req: NextRequest) {
    try {
        const user = getAuth(req);
        if (!user || !user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await req.json();
        const { folderId } = body;
        // console.log(files);
        if (folderId) {
            const output = await prisma.folders.delete({
                where : {
                    id : folderId
                }
            });
            if (output) {
                return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something happened' }, { status: 500 })
    }
    return NextResponse.json({ message: 'No action taken' }, { status: 200 });
}