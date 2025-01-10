import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "@/app/app/app-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">{children}</div>
    </SidebarProvider>
  );
}
