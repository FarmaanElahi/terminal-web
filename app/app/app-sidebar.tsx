"use client";

import * as React from "react";
import {
  Activity,
  LayoutDashboard,
  Megaphone,
  Radar,
  Star,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This is sample data.
const data = {
  user: {
    name: "Farmaan Elahi",
    email: "farmaan81@gmail.com",
    avatar: "/profile.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Screener",
      url: "/app/screener",
      icon: Radar,
    },
    {
      title: "Watchlist",
      url: "/app/watchlist",
      icon: Star,
    },
    {
      title: "Alert",
      url: "/app/alerts",
      icon: Megaphone,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProductLogo />
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function Navigation() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={data.user.avatar} alt={data.user.name} />
          <AvatarFallback className="rounded-lg">
            {data.user.name
              .split(" ")
              .map((s) => s[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ProductLogo() {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
      <Activity className="size-4" />
    </div>
  );
}
