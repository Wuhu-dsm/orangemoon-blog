import { ArrowRight, Eye, Sparkles, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";
import ShowcaseGrid from "./ShowcaseGrid";
import { usePublicArticles, type PublicArticle } from "@/hooks/usePublicContent";

const CATEGORY_GRADIENTS = [
  "bg-gradient-to-r from-sky-400 to-blue-500",
  "bg-gradient-to-r from-emerald-400 to-teal-500",
  "bg-gradient-to-r from-rose-400 to-pink-500",
  "bg-gradient-to-r from-violet-400 to-purple-500",
  "bg-gradient-to-r from-amber-400 to-orange-500",
  "bg-gradient-to-r from-cyan-400 to-teal-500",
  "bg-gradient-to-r from-fuchsia-400 to-pink-500",
  "bg-gradient-to-r from-indigo-400 to-blue-500",
] as const;

function getCategoryGradient(category: string, index: number): string {
  // Deterministic: hash category string, use index as fallback
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = ((hash << 5) - hash + category.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash || index) % CATEGORY_GRADIENTS.length;
  return CATEGORY_GRADIENTS[idx];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

function mapArticle(article: PublicArticle, index: number) {
  const category =
    article.category || (article.tags.length > 0 ? article.tags[0] : "文章");
  const dateRaw =
    article.publishedAt ?? article.updatedAt ?? article.createdAt;
  const views = article.viewCount ?? article.readCount ?? article.views ?? 0;

  return {
    id: article._id,
    category,
    title: article.title,
    excerpt: article.summary ?? "",
    date: formatDate(dateRaw),
    views,
    coverImage: article.coverImage,
    gradient: getCategoryGradient(category, index),
  };
}

function SkeletonCard() {
  return (
    <Card className="relative flex h-full flex-col gap-0 overflow-hidden rounded-[14px] border border-white/60 bg-white/50 py-0 shadow-[0_12px_36px_rgba(125,211,252,0.22)] backdrop-blur-xl dark:bg-white/10">
      <Skeleton className="h-[84px] w-full rounded-t-[14px] rounded-b-none" />
      <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-full" />
        <div className="mt-auto flex items-center justify-between pt-1.5">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-2.5 w-8" />
        </div>
      </div>
    </Card>
  );
}

export default function LatestArticles() {
  const { data, isLoading, isError } = usePublicArticles({ pageSize: 3 });
  const items = data?.items ?? [];
  const articles = items.map((a, i) => mapArticle(a, i));

  const sectionBody = (() => {
    if (isLoading) {
      return (
        <ShowcaseGrid className="h-[156px]">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ShowcaseGrid>
      );
    }

    if (isError) {
      return (
        <div className="flex h-[156px] items-center justify-center">
          <p className="text-[11px] text-[#94A3B8]">加载失败，请稍后再试</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex h-[156px] items-center justify-center">
          <p className="text-[11px] text-[#94A3B8]">还没有文章，敬请期待</p>
        </div>
      );
    }

    return (
      <ShowcaseGrid className="h-[156px]">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-[14px] border border-white/60 bg-white/50 py-0 shadow-[0_12px_36px_rgba(125,211,252,0.22)] backdrop-blur-xl transition-all duration-300 ease-out hover:translate-y-[-3px] hover:shadow-[0_18px_48px_rgba(125,211,252,0.3)] group-[.is-active]:shadow-[0_10px_30px_rgba(125,211,252,0.28)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[14px] before:border before:border-white/50 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:left-4 after:top-3 after:h-[1px] after:w-[40%] after:bg-gradient-to-r after:from-white/80 after:to-transparent after:content-[''] dark:bg-white/10"
          >
            <div className="relative h-[84px] shrink-0 overflow-hidden rounded-t-[14px] bg-muted group-[.is-active]:h-full">
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={`${article.category}封面：${article.title}`}
                  width={320}
                  height={150}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                  <ImageOff
                    size={20}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-transparent group-[.is-active]:from-transparent group-[.is-active]:via-transparent group-[.is-active]:to-black/60" />
              <span
                className={cn(
                  "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
                  article.gradient
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
    );
  })();

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
      {sectionBody}
    </section>
  );
}