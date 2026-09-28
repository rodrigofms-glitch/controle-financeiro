'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      router.push(data.session ? '/dashboard' : '/login')
    })
  }, [])

  return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
}
