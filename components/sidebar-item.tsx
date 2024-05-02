'use client'
import React from 'react'
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    label: string,
    iconSrc: string,
    href: string
};

const SidebarItem = ({ label, iconSrc, href }: Props) => {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Button variant={active ? 'outline' : 'default'}
            className='justify-start h-[52px]' asChild>
            <Link href={href}>
                <Image src={iconSrc} alt={label} className='mr-5' height={40} width={40} />
                {label}
            </Link>
        </Button>
    )
}

export default SidebarItem;
