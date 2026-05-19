import BannerCarousel from '../../components/home/BannerCarousel'
import LatestArticles from '../../components/home/LatestArticles'
import FeaturedProjects from '../../components/home/FeaturedProjects'
import SubscribeBox from '../../components/home/SubscribeBox'

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <BannerCarousel />
      <LatestArticles />
      <FeaturedProjects />
      <SubscribeBox />
    </div>
  )
}
