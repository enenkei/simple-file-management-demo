import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { toast } from './ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    setFilteredFiles: (files: any) => void,
    userId: string
}

const SearchBar = ({ setFilteredFiles, userId }: Props) => {
    const [fileType,setFileType] = useState<string>("");
    const searchSchema = z.object({
        name: z.string().min(0).max(100)
    });
    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            name: ''
        }
    });
    const onSubmit = async (input: z.infer<typeof searchSchema>) => {
        await fetch(`/api/file/get?userId=${userId}&query=${input.name}`).then(async (resp) => {
            if (resp.ok || resp.status === 200) {
                const body = await resp.json();
                setFilteredFiles(body.files);
            }
        }).catch((err) => {
            console.error(err);
            toast({
                title: 'Error',
                description: 'Something happened💥😟😢',
                variant: 'destructive'
            });
        });
    }
    // const onFileTypeSelect = async(fileType : string) => {
    //     setFileType(fileType);
    //     await fetch(`/api/file/get?userId=${userId}&query=${fileType}`).then(async (resp) => {
    //         if (resp.ok || resp.status === 200) {
    //             const body = await resp.json();
    //             setFilteredFiles(body.files);
    //         }
    //     }).catch((err) => {
    //         console.error(err);
    //         toast({
    //             title: 'Error',
    //             description: 'Something happened💥😟😢',
    //             variant: 'destructive'
    //         });
    //     });
    // }
    
    return (
        <div>
            <Form {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex gap-2 items-center justify-star mx-auto'>
                        <FormField control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className='w-96' placeholder='File name' type='text' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}
                            className='dark:text-white text-slate-200'>
                            Search {form.formState.isSubmitting ? <Loader2Icon className='h-4 w-4 animate-spin ml-2' /> : (
                                <SearchIcon className='h-5 w-5 ml-2' />
                            )}
                        </Button>
                        {/* <Select value={fileType} onValueChange={onFileTypeSelect}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="File Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image/png">PNG</SelectItem>
                                <SelectItem value="image/jpeg">JPEG</SelectItem>
                                <SelectItem value="text/csv">CSV</SelectItem>
                                <SelectItem value="application/pdf">PDF</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SearchBar;
