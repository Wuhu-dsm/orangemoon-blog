import FeaturedProjects from './FeaturedProjects'
import SubscribeBox from './SubscribeBox'

export default function ProjectSubscribeSection() {
  return (
    <div className="flex flex-col gap-4">
      <FeaturedProjects />
      <SubscribeBox />
    </div>
  )
}
