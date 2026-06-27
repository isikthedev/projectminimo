"use client"

import * as React from "react"
import {
  LayoutDashboard,
  BarChart3,
  PenTool,
  Image,
  FileCode,
  MessageSquare,
  Palette,
  Puzzle,
  Users,
  Settings,
  Command,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    email: string
  }
  tenant?: {
    name: string
    slug: string
  }
}

export function AppSidebar({ user, tenant, ...props }: AppSidebarProps) {
  const [activeUserEmail, setActiveUserEmail] = React.useState(user?.email || "m@example.com")
  const [activeTenantName, setActiveTenantName] = React.useState(tenant?.name || "My Workspace")

  React.useEffect(() => {
    // Dynamic client-side user and tenant name resolution
    fetch("/api/users/me")
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error("Failed to fetch")
      })
      .then((data) => {
        if (data?.user) {
          setActiveUserEmail(data.user.email)
          if (data.user.tenant && typeof data.user.tenant === "object") {
            setActiveTenantName(data.user.tenant.name || "My Workspace")
          }
        }
      })
      .catch(() => {})
  }, [])

  // Custom navigation structure
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart3,
        }
      ]
    },
    {
      title: "Posts",
      url: "/dashboard/posts",
      icon: PenTool,
    },
    {
      title: "Media",
      url: "/dashboard/media",
      icon: Image,
    },
    {
      title: "Pages",
      url: "/dashboard/pages",
      icon: FileCode,
    },
    {
      title: "Comments",
      url: "/dashboard/comments",
      icon: MessageSquare,
    },
    {
      title: "Appearance",
      url: "/dashboard/appearance",
      icon: Palette,
    },
    {
      title: "Addons",
      url: "/dashboard/addons",
      icon: Puzzle,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <Command className="size-5!" />
              <span className="text-base font-semibold">{activeTenantName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="px-2 py-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const hasSubmenu = item.items && item.items.length > 0
            
            return (
              <SidebarMenuItem key={item.title}>
                {hasSubmenu ? (
                  <div className="flex flex-col gap-1">
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      tooltip={item.title}
                    >
                      <Icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub className="ml-4 border-l border-zinc-200 dark:border-zinc-800 pl-2 flex flex-col gap-1">
                      {item.items?.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton render={<a href={subItem.url} />}>
                              <SubIcon className="size-3.5" />
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </div>
                ) : (
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.title}
                  >
                    <Icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={{
          name: activeUserEmail.split('@')[0],
          email: activeUserEmail,
          avatar: "/avatars/shadcn.jpg"
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
