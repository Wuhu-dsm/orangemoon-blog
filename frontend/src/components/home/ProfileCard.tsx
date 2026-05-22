import { Code, Mail, X } from "lucide-react";
import SectionCard from "@/components/ui/section-card";
import { useSettings } from "@/hooks/useSetting";
import type { SiteProfileSocial } from "@/api/setting";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Code,
  Mail,
  Twitter: X,
  X,
  Github: Code,
  GitHub: Code,
  知乎: X,
  微博: X,
  邮箱: Mail,
};

function resolveIcon(social: SiteProfileSocial) {
  return ICON_MAP[social.icon] || ICON_MAP[social.label] || Code;
}

const DEFAULT_STATS = [
  { label: "文章", value: "56" },
  { label: "项目", value: "12" },
  { label: "笔记", value: "89" },
  { label: "访客量", value: "3.2k" },
];

const DEFAULT_SOCIALS: SiteProfileSocial[] = [
  { icon: "Code", label: "GitHub", href: "#" },
  { icon: "Twitter", label: "知乎", href: "#" },
  { icon: "Twitter", label: "微博", href: "#" },
  { icon: "Mail", label: "邮箱", href: "#" },
];

export default function ProfileCard() {
  const settingsQuery = useSettings();
  const profile = settingsQuery.data?.profile;

  const stats = profile?.stats && profile.stats.length > 0
    ? profile.stats
    : DEFAULT_STATS;

  const socials = profile?.socials && profile.socials.length > 0
    ? profile.socials
    : DEFAULT_SOCIALS;

  return (
    <SectionCard
      padding="none"
      className="relative bg-[url('/images/home/profile.png')] bg-cover"
    >
      <div className="relative z-10 p-5">
        {/* Top row: avatar + info */}
        <div className="flex items-start gap-3 cursor-pointer">
          <img
            src={profile?.avatar || "/images/home/avatar.png"}
            alt={profile?.nickname || "Sora"}
            className="h-20 w-20 object-cover"
          />
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">
                {profile?.nickname || "Sora"}
              </h4>
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Lv.{profile?.level ?? 5}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.title || "前端开发 & 设计爱好者"}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
          {profile?.bio || "热爱技术，喜欢设计，也热爱生活。\n这里是我的数字花园 🌱"}
        </p>

        {/* Stats */}
        <div className="mt-2 grid grid-cols-4 gap-2 pt-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`cursor-pointer flex flex-col items-center ${i !== stats.length - 1 ? "border-r border-r-slate-300" : ""}`}
            >
              <span className="text-sm font-semibold">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-4 flex justify-center gap-14">
          {socials.map((s) => {
            const Icon = resolveIcon(s);
            return (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Icon size={14} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
