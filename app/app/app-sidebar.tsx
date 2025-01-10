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
  useSidebar,
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
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProductLogo onClick={toggleSidebar} />
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
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

function ProductLogo(props: { onClick: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={props.onClick}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Activity className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Terminal</span>
            <span className="truncate text-xs">10 Jan 2025</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
