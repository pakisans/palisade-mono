import { cn } from '@/lib/utils'

// JS scroll-animacije uklonjene: sadržaj se renderuje odmah vidljiv (bez opacity:0 /
// IntersectionObserver-a), da ga crawler i korisnici bez JS-a sigurno vide. Zadržano kao
// običan wrapper da ne diramo ~28 poziva — propovi delay/fade/threshold se ignorišu.
export default function ScrollReveal({ children, className }) {
  return <div className={cn(className)}>{children}</div>
}
