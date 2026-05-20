import BannerCarousel from "../../components/home/BannerCarousel";
import LatestArticles from "../../components/home/LatestArticles";
import ProjectSubscribeSection from "../../components/home/ProjectSubscribeSection";
import ProfileCard from "../../components/home/ProfileCard";
import ReadingStats from "../../components/home/ReadingStats";
import TagCloud from "../../components/home/TagCloud";
import Timeline from "../../components/home/Timeline";

export default function Home() {
  return (
    <div className="flex gap-6">
      <div className="flex flex-1 flex-col gap-6">
        <BannerCarousel />
        <LatestArticles />
        <ProjectSubscribeSection />
      </div>
      <aside className="hidden min-h-0 w-[550px] shrink-0 flex-col gap-4 overflow-y-auto pb-6 xl:flex 2xl:w-[500px] [&>*]:shrink-0">
        <ProfileCard />
        <ReadingStats />
        <div className="grid grid-cols-2 gap-4">
          <TagCloud />
          <Timeline />
        </div>
      </aside>
    </div>
  );
}
