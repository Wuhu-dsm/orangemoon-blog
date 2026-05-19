import styles from './Home.module.css'
import ArticleSection from './components/ArticleSection'
import DashboardLayout from './components/DashboardLayout'
import HeroBanner from './components/HeroBanner'
import ProfileCard from './components/ProfileCard'
import ProjectCarousel from './components/ProjectCarousel'
import ReadingStatsCard from './components/ReadingStatsCard'
import SubscribeBanner from './components/SubscribeBanner'
import TagCloudCard from './components/TagCloudCard'
import TimelineCard from './components/TimelineCard'

export default function Home() {
  return (
    <DashboardLayout>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <HeroBanner />
          <ArticleSection />
          <ProjectCarousel />
          <SubscribeBanner />
        </div>
        <div className={styles.rightColumn}>
          <ProfileCard />
          <ReadingStatsCard />
          <div className="grid gap-5 lg:grid-cols-2">
            <TagCloudCard />
            <TimelineCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
