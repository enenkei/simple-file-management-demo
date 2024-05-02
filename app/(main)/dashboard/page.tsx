'use client'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import SearchBar from '@/components/search-bar';
import { NewFolderDialog } from '@/components/new-folder-modal';
import Image from 'next/image';
import { files, folders } from '@prisma/client';
import FolderCard from '@/components/folder-card';

const FolderPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  if (!isLoaded || !isSignedIn) redirect('/sign-in');
  const { data: folders, refetch: refetchFolders } = useQuery({
    queryKey: ['get-folders', user.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/folder/get?userId=${user.id}`);
      return data.folders;
    }
  });
  // console.log(folders);
  const isLoading = folders === undefined;
  return (
    <div className='h-full w-full px-10 mx-auto pt-12 container'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-neutral-700'>
          Folders List
        </h1>
        <div>
          <Button onClick={() => setIsOpen(true)}>Create Folder</Button>
          <NewFolderDialog open={isOpen} setOpen={setIsOpen} userId={user.id} refetch={refetchFolders} />
        </div>
      </div>
      {isLoading && (
        <div className='flex flex-col gap-8 w-full items-center mt-24'>
          <Loader2Icon className='h-32 w-32 animate-spin text-gray-500' />
        </div>
      )}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3'>
              {folders && folders.map((folder : folders & {files : files[]}, idx: number) => (
                <FolderCard folder={folder} key={folder.id + idx} refetch={refetchFolders} />
              ))}
            </div>
      {folders && folders.length == 0 && (
        <div className='flex flex-col gap-8 mt-12 w-full items-center'>
          <Image src={'/images/undraw_folder_re_apfp.svg'} alt='no-files' width={300} height={300} />
          <p className='text-2xl text-purple-600'>You have no folders, create one now😎</p>
        </div>
      )}
    </div>
  )
}

export default FolderPage;
