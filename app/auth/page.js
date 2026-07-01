'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useLang } from '@/lib/LangContext'
import LinkyLogo from '@/components/LinkyLogo'
import Link from 'next/link'
import t from '@/lib/translations'

export default function AuthPage() {
  const { lang, toggleLang } = useLang()
  const l = t[lang]
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess(l.auth.successEmail)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials' ? l.auth.errorLogin :
        err.message === 'User already registered' ? l.auth.errorExists :
        err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 text-violet-600 mb-8">
          <LinkyLogo className="w-7 h-7" />
          <span className="text-2xl font-bold">Linky</span>
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              {l.auth.login}
            </button>
            <button onClick={() => setTab('signup')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              {l.auth.signup}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.auth.email}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.auth.password}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium disabled:opacity-50">
              {loading ? l.auth.processing : tab === 'signup' ? l.auth.createAccount : l.auth.login}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={toggleLang} className="text-xs text-gray-400 hover:text-violet-600">
              {t[lang].language}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
