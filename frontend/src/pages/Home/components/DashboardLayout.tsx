import type { ReactNode } from 'react'
import styles from '../Home.module.css'
import HomeSidebar from './HomeSidebar'
import TopBar from './TopBar'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardShell}>
        <HomeSidebar />
        <main className={styles.mainCanvas}>
          <TopBar />
          {children}
        </main>
      </div>
    </div>
  )
}
