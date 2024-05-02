'use client';
import { ClerkLoaded, ClerkLoading, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const Header = () => {
    const { isSignedIn, user } = useUser();
    return (
        <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b-slate-500'>
            <Link href='/' className='flex gap-x-2 items-center justify-center'>
                <Image src={'/images/cloud_folder_file_icon_219528.svg'} alt='logo' width={30} height={30} className='object-contain' />
                <span className='flex items-start font-semibold text-muted-foreground'>File Store</span>
            </Link>
            {user && isSignedIn ? (
                <>
                    <ClerkLoading>
                        <Loader2 className='h-5 w-5 text-muted-foreground animate-spin' />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl='/' />
                    </ClerkLoaded>
                </>
            ) : <>
                <Button size={'sm'}
                    className='font-medium bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-200 hover:text-slate-500'>
                    <SignInButton />
                </Button>
            </>}
        </header>
    )
}

export default Header;
