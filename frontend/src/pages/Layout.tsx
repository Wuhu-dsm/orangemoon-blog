import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import ProfileCard from '../components/home/ProfileCard'
import ReadingStats from '../components/home/ReadingStats'
import TagCloud from '../components/home/TagCloud'
import Timeline from '../components/home/Timeline'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-64">
        <Header />
        <div className="flex flex-1 gap-6 p-4 sm:p-6">
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          <aside className="hidden w-80 flex-shrink-0 flex-col gap-4 xl:flex">
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
