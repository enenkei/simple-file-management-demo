// import Header from '@/components/header';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React from 'react';

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <div className='min-h-screen flex flex-col'>
                {/* <Header /> */}
                <Sidebar />
                <main className='lg:pl-[200px] h-full pt-[50px] lg:pt-10'>
                    <div className='wax-w-[1056px] mx-auto h-full'>
                        {children}
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        </>
    )
}

export default Layout