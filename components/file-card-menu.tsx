import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadCloudIcon, Loader2Icon, MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from './ui/use-toast';
import { deleteFileFromFirebase } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';


type Props = {
    fileId : string,
    fileName : string,
    fileUrl : string,
    folderName : string,
    refetch : () => void
}

const FileCardMenu = ({fileId, fileName, refetch, fileUrl, folderName} : Props) => {
    const {user} = useUser();
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [isPending,setIsPending] = useState<boolean>(false);
    const onDeleteFile = async() => {
        setIsPending(true);
        await fetch('/api/file/delete', {
            method : 'post',
            body : JSON.stringify({fileId})
        }).then(async(resp) => {
            if(resp.ok || resp.status === 200){
                if (resp.ok || resp.status === 200) {
                    await deleteFileFromFirebase(user?.id!, folderName!, fileName);
                    toast({description : 'Files deleted successfully', variant : 'success'});
                    refetch();
                } else {
                    toast({
                        title : 'Error',
                        description : 'Something wrong happened💥😟😢',
                        variant : 'destructive'
                    });
                }
            }
        }).finally(() => {
            setIsConfirm(false);
            setIsPending(false);
        })
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger><MoreVerticalIcon className='h-5 w-5 mx-2' /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsConfirm(true)}>
                        <Trash2Icon className='h-5 w-5 mr-2' />Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <DownloadCloudIcon className='h-5 w-5 mr-2' />
                        <Link href={fileUrl} target='_blank' rel="noopener noreferrer">
                            Download
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <PencilIcon className='h-5 w-5 mr-2' />Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={isConfirm} onOpenChange={() => setIsConfirm(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the file
                            <span className='font-semibold text-rose-600'>&nbsp;{fileName.substring(0,20)}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction disabled={isPending} onClick={onDeleteFile}>
                            Continue{isPending && <Loader2Icon className='h-4 w-4 animate-spin ml-2' />}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    )
}

export default FileCardMenu;
