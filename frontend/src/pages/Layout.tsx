import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import ProfileCard from '../components/home/ProfileCard'
import ReadingStats from '../components/home/ReadingStats'
import TagCloud from '../components/home/TagCloud'
import Timeline from '../components/home/Timeline'
import { useSidebarStore } from '../stores/sidebarStore'

export default function Layout() {
  const collapsed = useSidebarStore((state) => state.collapsed)

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div
        className={`flex h-screen flex-col bg-gradient-to-b from-sky-50 via-cyan-50/30 to-teal-50/20 transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <Header />
        <div className="flex flex-1 gap-6 overflow-hidden p-4 sm:p-6">
          <main className="w-[60%] min-w-0 overflow-hidden">
            <Outlet />
          </main>
          <aside className="hidden flex-1 flex-shrink-0 flex-col gap-4 overflow-hidden xl:flex">
            <ProfileCard />
            <ReadingStats />
            <div className="grid grid-cols-2 gap-4">
              <TagCloud />
              <Timeline />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
