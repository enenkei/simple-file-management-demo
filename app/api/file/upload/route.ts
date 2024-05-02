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
        const { files } = body;
        // console.log(files);
        if (files.length > 0) {
            const data = files.map((file: any) => {
                return {
                    name: file.name,
                    userId: user?.userId!,
                    downloadUrl: file.downloadUrl,
                    type : file.fileType,
                    parentFolderId : file.folderId
                }
            });
            const output = await prisma.files.createMany({
                data
            });
            if (output) {
                return NextResponse.json({ message: 'Upload successfully' }, { status: 200 });
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Something happened' }, { status: 500 })
    }
    return NextResponse.json({ message: 'No action taken' }, { status: 200 });
}