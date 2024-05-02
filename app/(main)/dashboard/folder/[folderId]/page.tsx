'use client'
import { columns } from '@/components/data-table/column'
import { DataTable } from '@/components/data-table/file-data-table'
import FileCard from '@/components/file-card'
import FileUploadModal from '@/components/file-upload-modal'
import SearchBar from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@clerk/nextjs'
import { files } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Grid3X3Icon, Loader2Icon, Table2Icon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    params: {
        folderId: string
    }
}

const FolderIdPage = ({ params }: Props) => {
    const folderId = params.folderId;
    const { isLoaded, isSignedIn, user } = useUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredFiles, setFilteredFiles] = useState<any>([]);
    if (!isLoaded || !isSignedIn) redirect('/sign-in');
    const { data: folder, refetch: refetchFiles } = useQuery({
        queryKey: ['get-files', user.id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/file/get?userId=${user.id}&folderId=${folderId}`);
            return data.folder;
        }
    });
    // console.log(filteredFiles);
    const isLoading = folder && folder.files === undefined;
    return (
        <div className='h-full w-full px-10 mx-auto pt-12 container'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-2xl font-bold text-neutral-700 underline'>
                    {folder?.name}
                </h1>
                <div>
                    <Button onClick={() => setIsOpen(true)}>Upload File</Button>
                    <FileUploadModal open={isOpen} setOpen={setIsOpen} userId={user.id} refetch={refetchFiles} folderId={folderId} folderName={folder?.name}/>
                </div>
            </div>
            <SearchBar setFilteredFiles={setFilteredFiles} userId={user.id} />
            {isLoading && (
                <div className='flex flex-col gap-8 w-full items-center mt-24'>
                    <Loader2Icon className='h-32 w-32 animate-spin text-gray-500' />
                </div>
            )}
            <div className='my-4'>
                <Tabs defaultValue="grid" className="w-full">
                    <TabsList>
                        <TabsTrigger value="grid"><Grid3X3Icon className='h-4 w-4 mr-2' />Grid</TabsTrigger>
                        <TabsTrigger value="table"><Table2Icon className='h-4 w-4 mr-2' />Table</TabsTrigger>
                    </TabsList>
                    <TabsContent value="grid">
                        <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-4 mt-3'>
                            {folder && folder.files && folder.files.map((file: files, idx: number) => (
                                <FileCard file={file} key={file.id + idx} refetch={refetchFiles} folderName={folder?.name}/>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="table">
                        {folder && folder.files && folder.files.length > 0 && (
                            <DataTable data={folder.files} columns={columns} refetch={refetchFiles} folderName={folder?.name}/>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {folder && folder.files && folder.files.length == 0 && (
                <div className='flex flex-col gap-8 mt-12 w-full items-center'>
                    <Image src={'/images/undraw_folder_re_apfp.svg'} alt='no-files' width={300} height={300} />
                    <p className='text-2xl text-purple-600'>You have no files, upload now😎</p>
                </div>
            )}


        </div>
    )
}

export default FolderIdPage;
