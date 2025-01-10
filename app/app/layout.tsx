import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/client";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      {/*<SidebarProvider>*/}
      {/*<AppSidebar />*/}
      <div className="h-full">{children}</div>
      {/*</SidebarProvider>*/}
    </ReactQueryProvider>
  );
}
