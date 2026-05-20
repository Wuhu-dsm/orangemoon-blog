import { Code, Mail, X } from "lucide-react";
import SectionCard from "@/components/ui/section-card";

const stats = [
  { label: "文章", value: "56" },
  { label: "项目", value: "12" },
  { label: "笔记", value: "89" },
  { label: "访客量", value: "3.2k" },
];

const socials = [
  { icon: Code, label: "GitHub", href: "#" },
  { icon: X, label: "知乎", href: "#" },
  { icon: X, label: "微博", href: "#" },
  { icon: Mail, label: "邮箱", href: "#" },
];

export default function ProfileCard() {
  return (
    <SectionCard
      padding="none"
      className="relative bg-card"
    >
      <div
        aria-hidden="true"
        className="profile-card-breeze pointer-events-none absolute -inset-x-3 -inset-y-2 bg-[url('/images/home/profile.png')] bg-cover bg-center"
      />
      <div className="relative z-10 p-5">
        {/* Top row: avatar + info */}
        <div className="flex items-start gap-3 cursor-pointer">
          <img
            src="/images/home/avatar.png"
            alt="Sora"
            className="h-20 w-20 object-cover"
          />
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">Sora</h4>
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Lv.5
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              前端开发 & 设计爱好者
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          热爱技术，喜欢设计，也热爱生活。
          <br />
          这里是我的数字花园 🌱
        </p>

        {/* Stats */}
        <div className="mt-2 grid grid-cols-4 gap-2  pt-4">
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
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                className=" flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
