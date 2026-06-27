"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  trigger: React.ReactElement
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

const NotificationDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align={align} className="w-80 p-2">
        <DropdownMenuLabel className="font-semibold px-2 py-1.5 text-sm">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="py-4 text-center text-sm text-muted-foreground">
          No new notifications
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
