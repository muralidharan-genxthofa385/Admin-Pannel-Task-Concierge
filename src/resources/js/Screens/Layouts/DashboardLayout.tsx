import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import headderTCLOGO from '../../../../assets/images/taskconciegeLogo.svg';
import React from 'react';
import Typography from '@mui/material/Typography';
import { themes } from '@/Themes';

type layoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: layoutProps) {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '16rem',
      } as React.CSSProperties}
    >
      <div className="h-screen w-full flex overflow-hidden bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b bg-white p-3 md:p-5 flex items-center gap-3 sticky top-0 z-10">
            <SidebarTrigger className="p-2  hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </SidebarTrigger>

            <div className="md:hidden flex-1 flex justify-center">
              <img
                src={headderTCLOGO}
                alt="Task Concierge"
                className="h-7 w-auto max-w-[120px]"
              />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-3 w-full lg:p-8 overflow-y-auto  overflow-x-hidden bg-gray-30">
            <div className=" mx-auto w-full">
              {children}
            </div>
          </main>

          {/*---------------- Footer */}
          <footer className="border-t bg-white p-4 md:p-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs md:text-sm text-gray-600">
              <Typography
                sx={{
                  ...themes.mediumSizedFont,
                  fontSize: { xs: '12px', md: '14px' },
                  fontWeight: 600,
                }}
              >
                Task Concierge © 2025. All rights reserved.
              </Typography>
              <Typography
                sx={{
                  ...themes.mediumSizedFont,
                  fontSize: { xs: '12px', md: '14px' },
                  fontWeight: 600,
                }}
              >
                Made with ❤️ by GenX Thofa Technologies
              </Typography>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;