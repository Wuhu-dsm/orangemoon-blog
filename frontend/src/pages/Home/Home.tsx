import BannerCarousel from "../../components/home/BannerCarousel";
import LatestArticles from "../../components/home/LatestArticles";
import ProjectSubscribeSection from "../../components/home/ProjectSubscribeSection";
import ProfileCard from "../../components/home/ProfileCard";
import SubscribeBox from "../../components/home/SubscribeBox";
import TagCloud from "../../components/home/TagCloud";
import Timeline from "../../components/home/Timeline";

export default function Home() {
  return (
    <div className="flex gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <BannerCarousel />
        <LatestArticles />
        <ProjectSubscribeSection />
      </div>
      <aside className="hidden min-h-0 w-[550px] shrink-0 flex-col gap-3 overflow-y-auto pb-6 xl:flex 2xl:w-[500px] [&>*]:shrink-0">
        <ProfileCard />
        <div className="grid grid-cols-2 gap-3">
          <TagCloud />
          <Timeline />
        </div>
        <SubscribeBox />
      </aside>
    </div>
  );
}
