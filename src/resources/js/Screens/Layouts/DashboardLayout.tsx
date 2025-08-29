import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
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
    <header className='p-3 border w-full'>
<SidebarTrigger className="hover:bg-gray-100 bg-white w-10 h-10 cursor-pointer [&_svg]:w-30 [&_svg]:h-30"/>

</header>

<main className='flex-1 p-12 overflow-auto w-full '>{children}</main>

</div>
    </div>
</SidebarProvider>
    </>
  )
}

export default DashboardLayout