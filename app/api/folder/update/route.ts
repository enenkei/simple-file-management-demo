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
        const { name, color, folderId } = body.data;
        console.log(name);
        if (name && color) {
            const output = await prisma.folders.update({
                data: {
                    name,
                    color
                },
                where : {
                    id : folderId
                }
            });
            if (output) {
                return NextResponse.json({ message: 'Folder updated successfully' }, { status: 200 });
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something happened' }, { status: 500 })
    }
    return NextResponse.json({ message: 'No action taken' }, { status: 200 });
}