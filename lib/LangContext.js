'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('linky-lang')
    if (saved === 'es' || saved === 'en') setLang(saved)
  }, [])

  function toggleLang() {
    const next = lang === 'en' ? 'es' : 'en'
    setLang(next)
    localStorage.setItem('linky-lang', next)
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
