import { createBrowserRouter, Navigate } from 'react-router-dom'
import OwnerLogin from '../pages/Auth/OwnerLogin'
import Home from '../pages/Home/Home'
import Layout from '../pages/Layout'
import AdminRouteGuard from '../components/admin/AdminRouteGuard'
import AdminLayout from '../pages/Admin/AdminLayout'
import AdminOverview from '../pages/Admin/AdminOverview'
import AdminArticles from '../pages/Admin/AdminArticles'
import AdminNotes from '../pages/Admin/AdminNotes'
import AdminProjects from '../pages/Admin/AdminProjects'
import AdminFriendLinks from '../pages/Admin/AdminFriendLinks'
import AdminGuestbook from '../pages/Admin/AdminGuestbook'
import AdminUsers from '../pages/Admin/AdminUsers'

export const router = createBrowserRouter([
  {
    path: '/owner-login',
    element: <OwnerLogin />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: '/admin',
    element: (
      <AdminRouteGuard>
        <AdminLayout />
      </AdminRouteGuard>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'articles', element: <AdminArticles /> },
      { path: 'articles/new', element: <AdminArticles /> },
      { path: 'articles/:id/edit', element: <AdminArticles /> },
      { path: 'notes', element: <AdminNotes /> },
      { path: 'notes/new', element: <AdminNotes /> },
      { path: 'notes/:id/edit', element: <AdminNotes /> },
      { path: 'projects', element: <AdminProjects /> },
      { path: 'projects/new', element: <AdminProjects /> },
      { path: 'projects/:id/edit', element: <AdminProjects /> },
      { path: 'friends', element: <AdminFriendLinks /> },
      { path: 'guestbook', element: <AdminGuestbook /> },
      { path: 'users', element: <AdminUsers /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
])
