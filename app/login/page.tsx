'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Entrar</h1>
        {erro && <p className="text-red-500 text-sm">{erro}</p>}
        <input type="email" placeholder="E-mail" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Senha" value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded" required />
        <button className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Entrar
        </button>
        <p className="text-sm text-center">
          Não tem conta? <a href="/register" className="text-indigo-600">Cadastre-se</a>
        </p>
      </form>
    </div>
  )
}
