import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils";
import { toast } from "./ui/use-toast";
// import { CollectionColor, CollectionColors } from "@/lib/constants";

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void,
    userId?: string
}

export enum CollectionColors {
    sunset = 'bg-[#FFC100]',
    poppy = 'bg-[#FFD0D0]',
    rosebud = 'bg-[#FA7070]',
    cobaltblue = 'bg-[#124076]',
    candy = 'bg-[#94FFD8]',
    firttree = 'bg-[#A1C398]',
    metal = 'bg-[#A5C9CA]',
    powder = 'bg-[#EEEEEE]',
}

export type CollectionColor = keyof typeof CollectionColors;

export function NewFolderDialog({ open, setOpen, refetch, userId }: Props) {
    const newFolderSchema = z.object({
        name: z.string().min(3).max(50, {
            message: 'Folder name is required'
        }),
        color : z.string().refine(color => Object.keys(CollectionColors).includes(color))
    });
    const form = useForm<z.infer<typeof newFolderSchema>>({
        resolver: zodResolver(newFolderSchema),
        defaultValues: {}
    });
    const onSubmit = async (input: z.infer<typeof newFolderSchema>) => {
        // console.log(input);
        await fetch('/api/folder/create', {
            method : 'post',
            body : JSON.stringify({input})
        }).then((resp) => {
            if(resp.ok || resp.status === 200){
                toast({description : 'Folder created successfully', variant : 'success'});
                refetch();
                setOpen(false);
                form.reset();
            }else {
                toast({
                    title : 'Error',
                    description : 'Something happened💥😟😢',
                    variant : 'destructive'
                });
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Folder</DialogTitle>
                    <DialogDescription>
                        Add a new folder
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4 gap-4'>
                    <Form {...form}>
                        <form className='space-y-4 flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Folder Name' type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={(color) => field.onChange(color)}>
                                                <SelectTrigger className={
                                                    cn('w-full h-8 text-slate-400', CollectionColors[field.value as CollectionColor])
                                                }>
                                                    <SelectValue placeholder='Color' className='w-full h-8'></SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='w-full'>
                                                    {Object.keys(CollectionColors).map((color) => (
                                                        <SelectItem key={color} value={color} className={
                                                            cn(`w-full h-8 rounded-lg text-slate-500 focus:text-slate-300 focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset focus:px-8`,
                                                                CollectionColors[color as CollectionColor])
                                                        }>
                                                            {color}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>Pick a color</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
    )
}
