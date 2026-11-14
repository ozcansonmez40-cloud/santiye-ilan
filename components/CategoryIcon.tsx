import type { ListingCategory } from '@/lib/types'

export default function CategoryIcon({ category, className = 'w-7 h-7' }: { category: ListingCategory; className?: string }) {
  const paths = {
    emlak: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-8h6v8" /></>,
    vasita: <><path d="m5 8 2-5h10l2 5M3 9h18v9H3zM5 18v3M19 18v3M6 13h2M16 13h2" /></>,
    urun: <><path d="m3 7 9-4 9 4v11l-9 4-9-4zM3 7l9 4 9-4M12 11v11M7 5l10 4" /></>,
    hizmet: <><path d="m14 7 3 3 4-4a6 6 0 0 1-8 8l-7 7-4-4 7-7a6 6 0 0 1 8-8z" /></>,
    is: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V3h8v4M3 12a20 20 0 0 0 18 0M12 11v5" /></>,
  }
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[category]}</svg>
}
