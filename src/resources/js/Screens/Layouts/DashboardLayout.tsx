import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import headderTCLOGO from '../../../../assets/images/taskconciegeLogo.svg'
import React from 'react'


type layoutProps={
children:React.ReactNode
}

function DashboardLayout({children}:layoutProps) {
  return (
    <>
    <SidebarProvider>
    <div className='h-screen flex w-full'>
<AppSidebar/>
<div className='flex-1 flex flex-col'>
    <header className='p-3 border w-full flex'>
<SidebarTrigger className="hover:bg-gray-100 bg-white w-10 h-10 cursor-pointer [&_svg]:w-30 [&_svg]:h-30"/>
<div className='block md:hidden flex justify-center w-[70%]'> <img src={headderTCLOGO} className='w-30' /></div>
</header>

<main className='flex-1 p-12 w-[99%] ' style={{msOverflowX:"hidden"}}>{children}</main>

</div>
    </div>
</SidebarProvider>
    </>
  )
}

export default DashboardLayout