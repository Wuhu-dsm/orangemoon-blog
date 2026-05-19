import profileCardBg from '@/assets/home/profile-card-bg.png'
import { profileStats, socialActions } from '../data'
import styles from '../Home.module.css'
import IconActionButton from './IconActionButton'

export default function ProfileCard() {
  return (
    <aside
      className={`${styles.glassPanel} relative overflow-hidden p-6`}
      aria-labelledby="home-profile-title"
    >
      <img
        src={profileCardBg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-12"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/76 to-[#ecfbff]/84" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img
          src={profileCardBg}
          alt="Sora avatar"
          className="size-24 rounded-[28px] border-4 border-white object-cover shadow-lg shadow-sky-100"
        />
        <div className="mt-4 flex items-center gap-2">
          <h2 id="home-profile-title" className="text-2xl font-bold text-[#173861]">
            Sora
          </h2>
          <span className="rounded-full border border-[#bfeaf0] bg-[#e9fbff] px-2.5 py-1 text-xs font-bold text-[#17a7a0]">
            Lv.5
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-[#6f86a5]">
          前端开发 & 设计爱好者
        </p>
        <p className="mt-4 max-w-[18rem] text-sm leading-6 text-[#526b8f]">
          热爱技术，喜欢设计，也热爱生活。这里是我的数字花园。
        </p>
      </div>

      <dl className="relative z-10 mt-6 grid grid-cols-4 gap-2">
        {profileStats.map((stat) => (
          <div
            key={stat.label}
            className={`${styles.softPanel} min-w-0 px-2 py-3 text-center`}
          >
            <dt className="truncate text-xs font-medium text-[#7390ad]">
              {stat.label}
            </dt>
            <dd className="mt-1 text-lg font-bold text-[#173861]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className="relative z-10 mt-6 flex items-center justify-center gap-2"
        aria-label="社交链接"
      >
        {socialActions.map((action) => (
          <IconActionButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            className="size-10 rounded-xl"
          />
        ))}
      </div>
    </aside>
  )
}
