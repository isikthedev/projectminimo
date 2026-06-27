"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/user-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/notification-dropdown";
import { BellRing, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface SiteHeaderProps {
  tenantName?: string;
  userEmail?: string;
  userName?: string;
}

export function SiteHeader({
  tenantName = "Minimo",
  userEmail = "",
  userName = "",
}: SiteHeaderProps) {
  const initials = userName ? userName.slice(0, 2).toUpperCase() : "US";

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer" />
        <InputGroup className="h-9 rounded-md">
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <span className="hidden md:inline-block text-sm font-semibold text-zinc-900 dark:text-zinc-100 ml-2">
          {tenantName}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <button className="rounded-full p-2 hover:bg-accent relative cursor-pointer focus:outline-none">
              <BellRing className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
            </button>
          }
        />
        <UserDropdown
          defaultOpen={false}
          align="center"
          userEmail={userEmail}
          userName={userName}
          trigger={
            <button className="rounded-full focus:outline-none cursor-pointer">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://images.shadcnspace.com/assets/profiles/user-11.jpg"
                  alt={userName || "User"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          }
        />
      </div>
    </div>
  );
}
