'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const router = useRouter()
  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center flex-wrap gap-2">
      <div className="flex gap-4 font-medium flex-wrap">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/transacoes">Transações</Link>
        <Link href="/cartoes">Cartões</Link>
        <Link href="/metas">Metas</Link>
        <Link href="/categorias">Categorias</Link>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button onClick={sair} className="text-red-500 text-sm">Sair</button>
      </div>
    </nav>
  )
}
