export default function LinkyLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 32 L16 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 16 L32 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="8" cy="32" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="32" cy="8" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  )
}
