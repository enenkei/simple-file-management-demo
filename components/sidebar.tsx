'use client';
import { cn } from '@/lib/utils';
// import Image from 'next/image'
// import Link from 'next/link'
import React from 'react'
import { ClerkLoaded, ClerkLoading, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';
import SidebarItem from './sidebar-item'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

type Props = {
    className?: string
}

const Sidebar = ({ className }: Props) => {
    const { isSignedIn, user } = useUser();
    return (
        <div className={cn(
            'flex h-full lg:w-[220px] lg:fixed left-0 top-0 px-4 shadow-lg rounded-r-xl flex-col',
            className
        )}>
            <Link href={'/'}>
                <div className='pt-8 pl-2 pb-7 flex items-center gap-x-1'>
                    <Image src='/images/cloud_folder_file_icon_219528.svg' height={45} width={45} alt='file_icon' />

                    <h1 className='text-md font-extrabold text-indigo-600 tracking-wide'>
                        Files-Store
                    </h1>
                </div>
            </Link>
            <div className='flex flex-col gap-y-2 flex-1'>
                <SidebarItem
                    label='Dashboard'
                    iconSrc='/images/ic_dashboard_128_28270.png'
                    href='/dashboard' />
                {/* <SidebarItem
                    label='Leaderboard'
                    iconSrc='/images/chevron-rank-svgrepo-com.svg'
                    href='/leaderboard' />
                <SidebarItem
                    label='Quests'
                    iconSrc='/images/target-svgrepo-com.svg'
                    href='/quests' />
                <SidebarItem
                    label='Shop'
                    iconSrc='/images/shop-for-rent-svgrepo-com.svg'
                    href='/shop' /> */}
            </div>
            <div className='p-4'>
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
                <div className='font-medium bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-blue-200 hover:text-slate-500'>
                    <SignInButton />
                </div>
            </>}
            </div>
        </div>
    )
}

export default Sidebar;