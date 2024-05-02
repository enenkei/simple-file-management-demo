import { files, folders } from '@prisma/client'
import React, { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
// import { Button } from './ui/button';
import Image from 'next/image';
import moment from 'moment';
import FolderCardMenu from './folder-card-menu';
import { ArrowBigRightDashIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from './new-folder-modal';
import { useRouter } from 'next/navigation';

type Props = {
    folder: folders & {
        files: files[]
    },
    refetch: () => void
}

const FolderCard = ({ folder, refetch }: Props) => {
    const router = useRouter();
    return (
        <Card className={cn(
            'shadow-md border-none w-[220px] h-[160px]',
            CollectionColors[folder.color as CollectionColor]
        )}>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2'>
                    <div className='flex gap-2 flex-col'>
                    <p className='flex justify-start text-wrap text-sm'>{folder.name}</p>
                    </div>
                </CardTitle>
                <div className='absolute top-2 right-3'>
                    <FolderCardMenu folder={folder} refetch={refetch} />
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex gap-1 items-center'>
                    <p className='text-x p-2'><span className='text-indigo-700 font-semibold'>
                        {folder.files.length}&nbsp;Files</span>
                    </p>
                    <Button variant={'ghost'} size={'icon'} onClick={() => router.push(`/dashboard/folder/${folder.id}`)}>
                        <ArrowBigRightDashIcon className='h-6 w-6' />
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <p className='text-xs font-light text-slate-600 underline underline-offset-1 absolute'>{moment(folder.createdAt).format('MMM-ddd-yy HH:mm')}</p>
            </CardFooter>
        </Card>

    )
}

export default FolderCard;