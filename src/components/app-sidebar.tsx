import * as React from "react"
import { LayoutDashboard, Settings, SquarePen, ToolCase, User, Users } from "lucide-react"
import taskconciergelogo from "../assets/images/taskconciegeLogo.svg"
import taskconciregelogoCollapsed from '../assets/images/taskconciregelogoCollapsed.svg'
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const navItems = [
    {
    title:"Dashboard",
    url:"/Dashboard",
    icon:LayoutDashboard
  },
{
  title:"Tasks",
    url:"/tasks",
    icon:ToolCase
  }
  ,
  {
    title: "Taskers",
    url: "/taskers",
    icon: User,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title:"Services",
    url:"/services",
    icon:Settings
  },
  {
    title:"Service Questions",
    url:"/questions",
    icon:SquarePen
  },
  
  
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar() 
  const {pathname}=useLocation()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-4 flex justify-start">
          <img
            src={state=="collapsed"?taskconciregelogoCollapsed: taskconciergelogo}
            className={state === "collapsed" ? "w-7" : "w-50 h-auto"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="flex flex-col p-3 space-y-4">
          {navItems.map((item) =>{
          const isActive=pathname.startsWith(item.url)
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded  ${isActive ? "bg-[var(--color-purple)] text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <item.icon className="w-5 h-5" />
              {state !== "collapsed" && <span className="ml-2">{item.title}</span>}
            </NavLink>
          )})}
        </div>
      </SidebarContent>

      <SidebarFooter>
        {state !== "collapsed" && (
          <NavUser
            user={{
              name: "Admin",
              email: "admin@example.com",
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
