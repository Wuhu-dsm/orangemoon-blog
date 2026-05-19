import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
// import ProfileCard from '../components/home/ProfileCard'
// import ReadingStats from '../components/home/ReadingStats'
// import TagCloud from '../components/home/TagCloud'
// import Timeline from '../components/home/Timeline'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-64 xl:mr-80">
        <Header />
        <div className="flex flex-1 p-4 sm:p-6">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Right Panel — hidden on smaller screens */}
      <aside className="fixed right-0 top-0 z-30 hidden h-screen w-80 overflow-y-auto border-l border-border bg-card/50 backdrop-blur xl:flex xl:flex-col xl:gap-4 xl:p-4">
        {/* <ProfileCard />
        <ReadingStats />
        <div className="grid grid-cols-2 gap-4">
          <TagCloud />
          <Timeline />
        </div> */}
      </aside>
    </div>
  )
}
