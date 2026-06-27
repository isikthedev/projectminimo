"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo/logo";
import { NavMain } from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/nav-main";
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
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/site-header";



export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
  isActive?: boolean;
};

export const navData: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    href: "/dashboard/subscription",
  },
  { title: "Posts", icon: PenTool, href: "/dashboard/posts" },
  { title: "Media", icon: Image, href: "/dashboard/media" },
  { title: "Pages", icon: FileCode, href: "/dashboard/pages" },
  { title: "Comments", icon: MessageSquare, href: "/dashboard/comments" },
  { title: "Appearance", icon: Palette, href: "/dashboard/appearance" },
  { title: "Addons", icon: Puzzle, href: "/dashboard/addons" },
  { title: "Users", icon: Users, href: "/dashboard/users" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface AppSidebarProps {
  children: React.ReactNode;
  tenantName?: string;
  userEmail?: string;
  userName?: string;
}

const AppSidebar = ({ children, tenantName = "Minimo", userEmail = "", userName = "" }: AppSidebarProps) => {
  return (
      <SidebarProvider>
        <Sidebar className="py-4 px-0 bg-background" collapsible="offcanvas">
          <div className="flex flex-col gap-6 bg-background h-full">
            {/* ---------------- Header ---------------- */}
            <SidebarHeader className="py-0 px-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full h-full" render={<a href="/dashboard" />}>
                    <Command className="size-5!" />
                    <span className="text-base font-semibold">{tenantName}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            {/* ---------------- Content ---------------- */}
            <SidebarContent className="overflow-hidden gap-0 px-0 flex-1">
              <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
                <NavMain items={navData} />
              </div>

            </SidebarContent>
          </div>
        </Sidebar>

        {/* ---------------- Main ---------------- */}
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <header className="sticky top-0 z-50 flex items-center border-b px-6 py-3 bg-background">
            <SiteHeader tenantName={tenantName} userEmail={userEmail} userName={userName} />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SidebarProvider>
  );
};

export default AppSidebar;
