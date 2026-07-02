import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import LinkyLogo from '@/components/LinkyLogo'

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

  const bgColor = profile.bg_color || '#f5f5f5'
  const linkColor = profile.link_color || '#7c3aed'
  const linkBg = profile.link_bg || '#ffffff'

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-16" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-md text-center">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2" style={{ borderColor: linkColor }} />
        )}
        <h1 className="text-xl font-bold mb-1" style={{ color: '#1a1a1a' }}>{profile.display_name || username}</h1>
        {profile.bio && <p className="mb-6" style={{ color: '#4a4a4a' }}>{profile.bio}</p>}

        <div className="space-y-3">
          {links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 px-6 rounded-xl font-medium shadow-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: linkBg, color: linkColor, border: `1px solid ${linkColor}20` }}>
              {link.title}
            </a>
          ))}
        </div>

        {links.length === 0 && (
          <p className="text-gray-400 mt-8">No links yet</p>
        )}

        <div className="mt-12 flex items-center justify-center gap-1 text-xs text-gray-400">
          Created with <LinkyLogo className="w-3 h-3" /> Linky
        </div>
      </div>
    </div>
  )
}
