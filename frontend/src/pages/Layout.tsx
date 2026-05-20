import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useSidebarStore } from "../stores/sidebarStore";

export default function Layout() {
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div
        className={`flex h-screen flex-col bg-gradient-to-b from-sky-50 via-cyan-50/30 to-teal-50/20 transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        }`}
      >
        <Header />
        <div className="flex min-h-0 flex-1 overflow-hidden p-4 ">
          <main className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
