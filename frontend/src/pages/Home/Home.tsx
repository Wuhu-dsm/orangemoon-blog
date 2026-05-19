const stats = [
  { label: '文章', value: '0', helper: '等待第一篇发布' },
  { label: '项目', value: '0', helper: '作品集准备中' },
  { label: '笔记', value: '0', helper: '知识片段归档' },
]

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">SoraBlog</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-950 dark:text-gray-50">
          记录正在生长的想法
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          这里会汇集文章、项目、笔记和时间轴，成为一个可持续维护的个人知识空间。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {item.helper}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}
