import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "@/app/app/app-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="bg-gradient-to-r from-sidebar-primary to-[#E6DBFC]/30 h-full w-full">{children}</div>
    </SidebarProvider>
  );
}
