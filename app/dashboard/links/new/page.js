'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewLinkPage() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data: existing } = await supabase.from('links').select('position').eq('user_id', user.id).order('position', { ascending: false }).limit(1)
      const position = existing?.length > 0 ? existing[0].position + 1 : 0

      const { error } = await supabase.from('links').insert({
        user_id: user.id,
        title,
        url,
        position,
      })

      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft size={20} /> Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Nuevo link</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="Mi sitio web" maxLength={100}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} required
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar link'}
          </button>
        </form>
      </div>
    </div>
  )
}
