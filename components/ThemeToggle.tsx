'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const salvo = localStorage.getItem('theme')
    if (salvo === 'dark') { setDark(true); document.documentElement.classList.add('dark') }
  }, [])

  function toggle() {
    const novo = !dark
    setDark(novo)
    document.documentElement.classList.toggle('dark', novo)
    localStorage.setItem('theme', novo ? 'dark' : 'light')
  }

  return <button onClick={toggle} className="text-sm">{dark ? '☀️' : '🌙'}</button>
}
