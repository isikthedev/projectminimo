"use client";

import type { ReactElement } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LucideIcon,
  CircleUserRound,
  CreditCard,
  ReceiptText,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  userEmail?: string;
  userName?: string;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: CircleUserRound },
  { label: "My Subscription", icon: CreditCard },
  { label: "My Invoice", icon: ReceiptText },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Account Settings", icon: Settings },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: LogOut,
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

const UserDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
  userEmail = "user@example.com",
  userName = "User",
}: Props) => {
  const router = useRouter();

  const handleAction = async (label: string) => {
    if (label === "Signout") {
      try {
        const res = await fetch("/api/users/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          document.cookie = "payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          router.push("/login");
          router.refresh();
        }
      } catch (err) {
        console.error("Signout failed", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align={align} className="w-64 rounded-2xl">
          {/* User Info */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://images.shadcnspace.com/assets/profiles/user-11.jpg"
                    alt={userName}
                  />
                  <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2 ring-card" />
              </div>
              <div className="flex flex-col">
                <span className="text-popover-foreground text-sm font-medium">{userName}</span>
                <span className="text-muted-foreground text-xs">{userEmail}</span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass} onClick={() => handleAction(label)}>
                <Icon size={16} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass} onClick={() => handleAction(label)}>
                <Icon size={16} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className={itemClass}
              onClick={() => handleAction(LOGOUT_ITEM.label)}
            >
              <LOGOUT_ITEM.icon size={16} className="text-destructive" />
              <span className="text-destructive">{LOGOUT_ITEM.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
