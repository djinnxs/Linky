import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Linky - Tu Link in Bio profesional',
  description: 'Crea tu página de links profesional en minutos. Perfecto para Instagram, TikTok, LinkedIn y más.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
