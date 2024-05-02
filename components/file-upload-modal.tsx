import React from 'react';
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { UploadCloud } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { uploadFileToFirebase } from '@/lib/firebase';
import { toast } from './ui/use-toast';

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void,
    userId?: string,
    folderId : string,
    folderName : string
}

type fileProps = {
    name: string,
    userId: string,
    downloadUrl: string,
    fileType: string,
    folderId : string
}

const FileUploadModal = ({ open, setOpen, refetch, userId, folderId, folderName }: Props) => {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});
    const fileuploadFormSchema = z.object({
        title: z.string().min(1).max(50, {
            message: 'Title is required (min 1, max 50 characters)'
        }),
        // file : z.custom<File | null>((val) => val instanceof File, "Required")
    });
    const form = useForm<z.infer<typeof fileuploadFormSchema>>({
        resolver: zodResolver(fileuploadFormSchema),
        defaultValues: {
            title: '',
            // file : undefined
        }
    });

    const onSubmit = async (input: z.infer<typeof fileuploadFormSchema>) => {
        let files = [];
        if (acceptedFiles.length > 0) {
            // console.log(acceptedFiles);
            for(const file of acceptedFiles) {
                const data = await uploadFileToFirebase(userId!, folderName ,file, input.title);
                const info: fileProps = {
                    name: data?.fileName!,//file?.name!,
                    userId: userId!,
                    downloadUrl: data?.downloadUrl!,
                    fileType: file.type,
                    folderId : folderId
                }
                files.push(info);
            }
        }
        if (files.length > 0) {
            // console.log(files);
            await fetch('/api/file/upload', {
                method: 'post',
                body: JSON.stringify({ files })
            }).then(async (resp) => {
                if (resp.ok || resp.status === 200) {
                    toast({description : 'Files uploaded successfully', variant : 'success'});
                } else {
                    toast({
                        title : 'Error',
                        description : 'Something happened💥😟😢',
                        variant : 'destructive'
                    });
                }
            });
        }
        form.reset();
        refetch();
        setOpen(false);
    }
    return (
        <>
            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex gap-2 p-1 place-content-center items-center'>
                            Uploading your file here
                        </DialogTitle>
                    </DialogHeader>
                    <div className='py-4 gap-4'>
                        <Form {...form}>
                            <form className='space-y-4 flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder='File title' type='text' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div {...getRootProps({ className: 'dropzone' })} >
                                    <input className="input-zone" multiple={true} {...getInputProps()} />
                                    <div className="text-center">
                                        <label className={`flex flex-col items-center justify-center w-[450px]
                                            h-[350px] border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer
                                            bg-gray-50 dark:bg-gray-600 hover:bg-gray-100
                                            dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud color="#0080c0" />
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to Upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <aside>
                                                <ul className="flex flex-col justify-start items-start w-full px-8 py-10 gap-2 text-balance">{
                                                    acceptedFiles.map((file, idx) => (
                                                        <li key={idx}>
                                                            {file.name} - {Math.round(file.size / 1024)} KB
                                                        </li>
                                                    )
                                                    )}</ul>
                                            </aside>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}
                            className='w-full dark:text-white text-slate-200'>
                            Confirm {form.formState.isSubmitting && <Loader2Icon className='h-4 w-4 animate-spin ml-2' />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FileUploadModal
