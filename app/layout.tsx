import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/providers/Providers'
import { InstallBanner } from '@/components/layout/InstallBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TrendWriter',
  description: 'LinkedIn Content Automation & Growth Intelligence',
  manifest: '/manifest.json',
  themeColor: '#0A66C2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          {children}
          <InstallBanner />
        </Providers>
      </body>
    </html>
  )
}