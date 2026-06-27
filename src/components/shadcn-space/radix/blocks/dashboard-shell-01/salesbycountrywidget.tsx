"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DEFAULT_DROPDOWN_ITEMS = [
  { title: "Action", link: "#" },
  { title: "Another action", link: "#" },
  { title: "Something else", link: "#" },
];

const DEFAULT_TRANS_DATA = [
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-us.svg",
    title: "PayPal Transfer",
    country: "United states",
    rank: "$8,567k",
    badgeData: "+4.7%",
    badgeBG: "bg-teal-400/10",
  },
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-brazil.svg",
    title: "Wallet",
    country: "Brazil",
    rank: "$2,415k",
    badgeData: "-1.7%",
    badgeBG: "bg-orange-400/10",
  },
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-india.svg",
    title: "Credit Card",
    country: "India",
    rank: "$865k",
    badgeData: "+4.7%",
    badgeBG: "bg-teal-400/10",
  },
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-australia.svg",
    title: "Bank Transfer",
    country: "Australia",
    rank: "$745k",
    badgeData: "-1.7%",
    badgeBG: "bg-orange-400/10",
  },
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-france.svg",
    title: "Refund",
    country: "France",
    rank: "$45",
    badgeData: "+4.7%",
    badgeBG: "bg-teal-400/10",
  },
  {
    img: "https://images.shadcnspace.com/assets/flags/flag-china.svg",
    title: "Refund",
    country: "China",
    rank: "$12k",
    badgeData: "+4.7%",
    badgeBG: "bg-teal-400/10",
  },
];

interface TransactionProps {
  img: string;
  title: string;
  country: string;
  rank: string;
  badgeData: string;
  badgeBG: string;
}

interface DropdownItemProps {
  title: string;
  link?: string;
}

interface WidgetProps {
  recentTransData?: TransactionProps[];
  dropdownItems?: DropdownItemProps[];
}

const SalesByCountryWidget = ({
  recentTransData = DEFAULT_TRANS_DATA,
  dropdownItems = DEFAULT_DROPDOWN_ITEMS,
}: WidgetProps) => {
  return (
    <Card className="h-full py-6 gap-6">
      <CardHeader className="flex items-center justify-between px-6">
        <CardTitle className="text-lg font-medium text-foreground">
          Sales by Countries
        </CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer focus:outline-none">
                  <EllipsisVertical
                    width={22}
                    height={22}
                    className="rotate-90"
                  />
                </button>
              }
            />
            <DropdownMenuContent>
              {dropdownItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="font-normal cursor-pointer"
                >
                  {item.link ? (
                    <a href={item.link} className="w-full">
                      {item.title}
                    </a>
                  ) : (
                    <span className="w-full justify-start">{item.title}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-col gap-3">
          {recentTransData.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex gap-3 items-center px-6 transition-all duration-200 hover:translate-x-1">
                <div className="w-8 h-8 rounded-full flex justify-center items-center overflow-hidden">
                  <img src={item.img} alt="icon" width={32} height={32} />
                </div>
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <h5 className="text-base font-medium text-foreground">
                      {item.rank}
                    </h5>
                    <p className="text-sm font-normal tracking-wide text-muted-foreground">
                      {item.country}
                    </p>
                  </div>
                  <Badge
                    className={cn(`${item.badgeBG}`, "text-muted-foreground")}
                  >
                    {item.badgeData}
                  </Badge>
                </div>
              </div>
              {index < recentTransData.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesByCountryWidget;
