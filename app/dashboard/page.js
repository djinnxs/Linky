'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { Plus, LogOut, Link as LinkIcon, ExternalLink, Trash2, GripVertical } from 'lucide-react'

export default function DashboardPage() {
  const [links, setLinks] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const [linksRes, profileRes] = await Promise.all([
      supabase.from('links').select('*').eq('user_id', user.id).order('position'),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ])

    setLinks(linksRes.data || [])
    setProfile(profileRes.data)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function deleteLink(id) {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter(l => l.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-violet-600">Linky</Link>
          <div className="flex items-center gap-4">
            <Link href={`/${profile?.username || 'me'}`} target="_blank" className="flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600">
              <ExternalLink size={16} /> Ver mi página
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis links</h1>
            <p className="text-gray-500 mt-1">Administra tus links ({links.length})</p>
          </div>
          <Link href="/dashboard/links/new" className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 text-sm font-medium">
            <Plus size={18} /> Nuevo link
          </Link>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <LinkIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tienes links aún</h3>
            <p className="text-gray-500 mb-6">Agrega tu primer link para empezar.</p>
            <Link href="/dashboard/links/new" className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700">
              Agregar link
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map(link => (
              <div key={link.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <GripVertical size={20} className="text-gray-300 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{link.title}</p>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{link.clicks || 0} clicks</span>
                  <button onClick={() => deleteLink(link.id)} className="p-1 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
