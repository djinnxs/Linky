'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import LinkyLogo from '@/components/LinkyLogo'
import t from '@/lib/translations'

export default function LandingPage() {
  const { lang, toggleLang } = useLang()
  const l = t[lang]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-violet-600">
          <LinkyLogo className="w-7 h-7" />
          <span className="text-2xl font-bold">Linky</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang} className="text-sm text-gray-500 hover:text-violet-600 px-2 py-1 rounded-md hover:bg-violet-50">
            {t[lang].language}
          </button>
          <Link href="/auth" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">{l.nav.login}</Link>
          <Link href="/auth?tab=signup" className="px-5 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium text-sm">
            {l.nav.signup}
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          {l.hero.title1}<br />
          <span className="text-violet-600">{l.hero.title2}</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">{l.hero.desc}</p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/auth?tab=signup" className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium text-lg">
            {l.hero.cta1}
          </Link>
          <Link href="/auth" className="px-8 py-3 border border-gray-300 rounded-xl hover:border-gray-400 font-medium text-lg">
            {l.hero.cta2}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {l.features.map(f => (
            <div key={f.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{l.pricing.title}</h2>
        <p className="text-gray-600 mb-8">{l.pricing.desc}</p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
          <p className="text-5xl font-bold text-violet-600">{l.pricing.priceLabel}</p>
          <p className="text-gray-500 mt-2">{l.pricing.month}</p>
          <ul className="mt-6 text-left space-y-3">
            {l.pricing.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link href="/auth?tab=signup" className="block mt-8 w-full px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium">
            {l.pricing.cta}
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © 2026 Linky. {l.footer} 💜
      </footer>
    </div>
  )
}
