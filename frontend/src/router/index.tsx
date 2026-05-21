import { createBrowserRouter } from 'react-router-dom'
import OwnerLogin from '../pages/Auth/OwnerLogin'
import Home from '../pages/Home/Home'
import Layout from '../pages/Layout'

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
])
