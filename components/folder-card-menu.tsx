import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2Icon, MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
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
import { UpdateFolderDialog } from './update-folder-modal';
import { folders } from '@prisma/client';


type Props = {
    folder : folders,
    refetch : () => void
}

const FolderCardMenu = ({folder, refetch} : Props) => {
    const {user} = useUser();
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [isPending,setIsPending] = useState<boolean>(false);
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const onDeleteFolder = async() => {
        setIsPending(true);
        const folderId = folder.id;
        await fetch('/api/folder/delete', {
            method : 'post',
            body : JSON.stringify({folderId})
        }).then(async(resp) => {
            if(resp.ok || resp.status === 200){
                if (resp.ok || resp.status === 200) {
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
                    <DropdownMenuItem onClick={() => setIsOpen(true)}>
                        <PencilIcon className='h-5 w-5 mr-2' />Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={isConfirm} onOpenChange={() => setIsConfirm(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the folder
                            <span className='font-semibold text-rose-600'>&nbsp;{folder.name}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction disabled={isPending} onClick={onDeleteFolder}>
                            Continue{isPending && <Loader2Icon className='h-4 w-4 animate-spin ml-2' />}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <UpdateFolderDialog folder={folder} open={isOpen} setOpen={setIsOpen} refetch={refetch}/>
        </>

    )
}

export default FolderCardMenu;