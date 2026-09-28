'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('despesa')
  const [cor, setCor] = useState('#4F46E5')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const { data } = await supabase.from('categories').select('*').order('nome')
    setCategorias(data || [])
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('categories').insert({ user_id: user?.id, nome, tipo, cor })
    setNome('')
    carregar()
  }

  async function excluir(id: string) {
    await supabase.from('categories').delete().eq('id', id)
    carregar()
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Categorias</h1>

        <form onSubmit={salvar} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm">Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="text-sm">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="p-2 border rounded">
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Cor</label>
            <input type="color" value={cor} onChange={(e) => setCor(e.target.value)}
              className="w-14 h-10 p-1 border rounded" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded h-10">Adicionar</button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl divide-y">
          {categorias.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ background: c.cor }} />
                <span>{c.nome}</span>
                <span className="text-xs text-gray-500">
                  ({c.tipo === 'receita' ? 'Receita' : 'Despesa'})
                </span>
              </div>
              <button onClick={() => excluir(c.id)} className="text-red-400 text-sm">Excluir</button>
            </div>
          ))}
          {categorias.length === 0 && (
            <p className="p-4 text-center text-gray-500">Nenhuma categoria cadastrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}
