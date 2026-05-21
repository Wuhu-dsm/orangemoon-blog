import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#F6FBFB] dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
