import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
const f = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['300', '500', '800'] })
export const metadata: Metadata = {
  title: 'Arseniy — My Journey',
  description: 'Личный сайт Арсения. AI, code, business, sport, development and life.',
  openGraph: { title: 'Arseniy — My Journey', description: 'Личный сайт Арсения. AI, code, business, sport, development and life.', type: 'website', locale: 'ru_RU' },
}
export const viewport: Viewport = { themeColor: '#050505', viewportFit: 'cover' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body className={f.className}>{children}</body></html>
}
