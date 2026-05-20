import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import ShowcaseGrid from "./ShowcaseGrid";

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  views: string;
  cover: string;
};

const articles: Article[] = [
  {
    id: 1,
    category: "技术",
    title: "我用 Next.js 14 重构了个人博客",
    excerpt: "记录一次从零到重构博客的过程，性能提升 60%，体验更丝滑。",
    date: "2024/06/01",
    views: "1.2k",
    cover: "/images/home/article-nextjs.png",
  },
  {
    id: 2,
    category: "生活",
    title: "去镰仓吧！吹吹海风看看海",
    excerpt: "日本镰仓旅行小记，镰仓高校前的海，真的会让人治愈。",
    date: "2024/05/28",
    views: "982",
    cover: "/images/home/article-kamakura.png",
  },
  {
    id: 3,
    category: "思考",
    title: "为什么我们总是很难坚持？",
    excerpt: "从习惯形成的底层逻辑出发，聊聊如何建立属于自己的系统。",
    date: "2024/05/20",
    views: "1.5k",
    cover: "/images/home/article-persistence.png",
  },
];

const visibleArticles = articles.slice(0, 3);

export default function LatestArticles() {
  return (
    <section className="rounded-[14px] border border-white/60 bg-white/60 p-3 shadow-[0_12px_40px_rgba(125,211,252,0.2)] backdrop-blur-xl sm:p-[14px]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]">
          <Sparkles size={14} className="text-cyan-400" />
          最新文章
        </h3>
        <Link
          to="/articles"
          className="flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={12} />
        </Link>
      </div>
      <ShowcaseGrid className="h-[156px]">
        {visibleArticles.map((article) => (
          <Card
            key={article.id}
            className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-[14px] border border-white/60 bg-white/50 py-0 shadow-[0_12px_36px_rgba(125,211,252,0.22)] backdrop-blur-xl transition-all duration-300 ease-out hover:translate-y-[-3px] hover:shadow-[0_18px_48px_rgba(125,211,252,0.3)] group-[.is-active]:shadow-[0_10px_30px_rgba(125,211,252,0.28)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[14px] before:border before:border-white/50 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:left-4 after:top-3 after:h-[1px] after:w-[40%] after:bg-gradient-to-r after:from-white/80 after:to-transparent after:content-[''] dark:bg-white/10"
          >
            <div className="relative h-[84px] shrink-0 overflow-hidden rounded-t-[14px] bg-muted group-[.is-active]:h-full">
              <img
                src={article.cover}
                alt={`${article.category}封面：${article.title}`}
                width={320}
                height={150}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-transparent group-[.is-active]:from-transparent group-[.is-active]:via-transparent group-[.is-active]:to-black/60" />
              <span
                className={cn(
                  "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
                  article.category === "技术" &&
                    "bg-gradient-to-r from-sky-400 to-blue-500",
                  article.category === "生活" &&
                    "bg-gradient-to-r from-emerald-400 to-teal-500",
                  article.category === "思考" &&
                    "bg-gradient-to-r from-rose-400 to-pink-500",
                )}
              >
                {article.category}
              </span>
              {/* Active card overlay */}
              <div className="absolute inset-x-0 bottom-0 hidden flex-col justify-end p-2.5 group-[.is-active]:flex">
                <h4 className="text-xs font-bold text-white drop-shadow-md">
                  {article.title}
                </h4>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-white/80 drop-shadow">
                  {article.excerpt}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/70">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={10} aria-hidden="true" />
                    {article.views}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="flex min-h-0 flex-1 flex-col px-2 pb-2 pt-1.5 group-[.is-active]:hidden">
              <h4 className="line-clamp-1 text-[11px] font-bold leading-tight text-[#1E293B]">
                {article.title}
              </h4>
              <p className="mt-1 line-clamp-1 min-h-[16px] text-[10px] leading-relaxed text-[#64748B]">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1.5 text-[10px] font-medium text-[#7C8CA8]">
                <span className="min-w-0 truncate">{article.date}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <Eye size={10} aria-hidden="true" />
                  {article.views}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </ShowcaseGrid>
    </section>
  );
}
