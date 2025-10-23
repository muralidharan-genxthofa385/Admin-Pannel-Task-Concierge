import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import headderTCLOGO from '../../../../assets/images/taskconciegeLogo.svg'
import React from 'react'
import Typography from '@mui/material/Typography'
import { themes } from '@/Themes'


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
<div className=' md:hidden flex justify-center w-[70%]'> <img src={headderTCLOGO} className='w-30' /></div>
</header>

<main className="flex-1 p-7 md:p-8 w-full box-border overflow-y-auto overflow-x-hidden " style={{msOverflowX:"hidden"}}>{children}</main>

<footer className='p-6 border-t w-full flex justify-between'>
  <Typography sx={{...themes.mediumSizedFont,fontSize:"15px",fontWeight:600}}>Task Concierge © 2025. All rights reserved.</Typography>
    <Typography sx={{...themes.mediumSizedFont,fontSize:"15px",fontWeight:600}}>Made with ❤️ by GenX Thofa Technologies</Typography>

  
</footer>
</div>
    </div>
</SidebarProvider>
    </>
  )
}

export default DashboardLayout