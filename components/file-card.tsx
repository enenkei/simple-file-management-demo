import { files } from '@prisma/client'
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
import FileCardMenu from './file-card-menu';
import { ImageIcon } from 'lucide-react';
import { FaFileCsv, FaRegFilePdf } from "react-icons/fa6";
import { GrDocumentTxt } from "react-icons/gr";
import moment from 'moment';

type Props = {
    file: files,
    refetch: () => void,
    folderName : string
}

export const fileTypeIcons = {
    "image/png": <ImageIcon className='h-6 w-6' />,
    "image/jpeg": <ImageIcon className='h-6 w-6' />,
    "text/csv": <FaFileCsv className='h-6 w-6' />,
    "application/pdf": <FaRegFilePdf className='h-6 w-6' />,
    "text/plain" : <GrDocumentTxt className='h-6 w-6' />,
} as Record<string, ReactNode>

const FileCard = ({ file, refetch, folderName }: Props) => {
    return (
        <Card className='shadow-md border-none'>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2'>
                    <div className='flex gap-2 flex-col'>
                        <div className='flex flex-row gap-1 justify-start items-center'>
                            <div className='flex justify-start'>{fileTypeIcons[file.type!]}</div>
                            <p className='text-xs font-light text-slate-600'>{moment(file.createdAt).format('MMM-ddd-yy HH:mm')}</p>
                        </div>
                        <p className='text-xs text-slate-500 break-all p-2'>{file.name}</p>
                    </div>
                </CardTitle>
                <div className='absolute top-2 right-3'>
                    <FileCardMenu fileId={file.id} fileName={file.name} refetch={refetch} fileUrl={file.downloadUrl} folderName={folderName} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
                {file.type?.includes('image') && (
                    <Image alt='preview' width={200} height={100} src={file.downloadUrl} />
                )}
                {file.type?.includes('csv') && (
                    <Image alt='preview' width={200} height={100} src={'/images/ext_csv_filetype_icon_176252.svg'} />
                )}
                {file.type?.includes('pdf') && (
                    <Image alt='preview' width={200} height={100} src={'/images/ext_pdf_filetype_icon_176234.svg'} />
                )}
                {file.type?.includes('plain') && (
                    <Image alt='preview' width={200} height={100} src={'/images/1497548411-12_84811.svg'} />
                )}
            </CardContent>
            <CardFooter>
                <div className='relative gap-1 w-full bottom-1'>
                    {/* <Button className='w-24' size={'sm'}>Download</Button>
                    <Button className='w-24' size={'sm'}>Delete</Button> */}

                </div>
            </CardFooter>
        </Card>

    )
}

export default FileCard;
