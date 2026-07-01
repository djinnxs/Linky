import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BioPage({ params }) {
  const supabase = await createServerSupabase()
  const username = (await params).username

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('position')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center px-4 pt-16">
      <div className="w-full max-w-md text-center">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200" />
        )}
        <h1 className="text-xl font-bold text-gray-900 mb-1">{profile.display_name || username}</h1>
        {profile.bio && <p className="text-gray-600 mb-6">{profile.bio}</p>}

        <div className="space-y-3">
          {links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-violet-300 transition-colors text-gray-800 font-medium shadow-sm">
              {link.title}
            </a>
          ))}
        </div>

        {links.length === 0 && (
          <p className="text-gray-400 mt-8">No hay links aún</p>
        )}

        <p className="mt-12 text-xs text-gray-400">Creado con Linky</p>
      </div>
    </div>
  )
}
