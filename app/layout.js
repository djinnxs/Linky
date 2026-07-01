import './globals.css'
import { Inter } from 'next/font/google'
import { LangProvider } from '@/lib/LangContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Linky - Your Link in Bio',
  description: 'Create your professional link-in-bio page in minutes. Perfect for Instagram, TikTok, LinkedIn and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
