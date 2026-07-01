import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-violet-600">Linky</span>
        <div className="flex gap-4">
          <Link href="/auth" className="px-4 py-2 text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
          <Link href="/auth?tab=signup" className="px-5 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium">
            Empezar gratis
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Tu link en bio,<br />
          <span className="text-violet-600">profesional y simple</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Una página elegante con todos tus links. Ideal para Instagram, TikTok, LinkedIn y cualquier red social.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/auth?tab=signup" className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium text-lg">
            Crear mi página gratis
          </Link>
          <Link href="/auth" className="px-8 py-3 border border-gray-300 rounded-xl hover:border-gray-400 font-medium text-lg">
            Iniciar sesión
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Super rápido', desc: 'Crea y edita tus links en segundos. Sin complicaciones.' },
            { icon: '📊', title: 'Analíticas', desc: 'Sabes cuántos clicks recibe cada link.' },
            { icon: '🎨', title: 'Personalizable', desc: 'Tu foto, tu bio, tus colores. Tu página, tus reglas.' },
          ].map(f => (
            <div key={f.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Precio único</h2>
        <p className="text-gray-600 mb-8">Sin planes complicados. Un solo precio.</p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
          <p className="text-5xl font-bold text-violet-600">$5</p>
          <p className="text-gray-500 mt-2">por mes</p>
          <ul className="mt-6 text-left space-y-3">
            {['Links ilimitados', 'Foto de perfil y bio', 'Analíticas de clicks', 'Personalización de colores'].map(f => (
              <li key={f} className="flex items-center gap-2 text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link href="/auth?tab=signup" className="block mt-8 w-full px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium">
            Empezar ahora
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © 2025 Linky. Hecho con 💜
      </footer>
    </div>
  )
}
