'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useLang } from '@/lib/LangContext'
import LinkyLogo from '@/components/LinkyLogo'
import Link from 'next/link'
import t from '@/lib/translations'
import { ArrowLeft, Check } from 'lucide-react'

export default function SettingsPage() {
  const { lang, toggleLang } = useLang()
  const l = t[lang]
  const [profile, setProfile] = useState({ username: '', display_name: '', bio: '', avatar_url: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile({
        username: data.username || '',
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
      })
      setSubscribed(data.subscribed || false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString(),
    })

    if (err) {
      setError(err.message.includes('profiles_username_key') ? l.settings.usernameTaken : err.message)
    } else {
      setMessage(l.settings.saved)
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  async function handleCheckout() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setError('Error processing payment')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-violet-600">
            <LinkyLogo className="w-6 h-6" />
            <span className="text-xl font-bold">Linky</span>
          </Link>
          <button onClick={toggleLang} className="text-xs text-gray-400 hover:text-violet-600">{t[lang].language}</button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft size={20} /> {l.nav.back}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{l.settings.title}</h1>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l.settings.username}</label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500">
              <span className="px-3 text-gray-500 text-sm bg-gray-50 py-2.5 border-r">linky.app/</span>
              <input type="text" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value.replace(/[^a-z0-9_-]/g, '') })} required maxLength={30}
                className="flex-1 px-3 py-2.5 focus:outline-none border-0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l.settings.displayName}</label>
            <input type="text" value={profile.display_name} onChange={e => setProfile({ ...profile, display_name: e.target.value })} maxLength={50}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l.settings.bio}</label>
            <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l.settings.avatarUrl}</label>
            <input type="url" value={profile.avatar_url} onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          {message && <p className="text-green-600 text-sm flex items-center gap-1"><Check size={16} /> {message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium disabled:opacity-50">
            {saving ? l.settings.saving : l.nav.save}
          </button>
        </form>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{l.settings.subscription}</h2>
          <p className="text-gray-600 text-sm mb-4">{l.settings.subDesc}</p>
          {subscribed ? (
            <p className="text-green-600 text-sm flex items-center gap-1"><Check size={16} /> {l.settings.subActive}</p>
          ) : (
            <button onClick={handleCheckout} className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 text-sm font-medium">
              {l.settings.subscribe}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
