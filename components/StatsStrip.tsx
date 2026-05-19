type Stat = {
  value: string
  label: string
}

type Props = {
  stats: Stat[]
}

export default function StatsStrip({ stats }: Props) {
  return (
    <div className="bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
            <p className="text-sm text-slate-300 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
