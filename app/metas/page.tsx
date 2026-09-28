'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

export default function Metas() {
  const [metas, setMetas] = useState<any[]>([])
  const [nome, setNome] = useState('')
  const [valorMeta, setValorMeta] = useState('')
  const [prazo, setPrazo] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false })
    setMetas(data || [])
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('goals').insert({
      user_id: user?.id, nome, valor_meta: Number(valorMeta), prazo: prazo || null,
    })
    setNome(''); setValorMeta(''); setPrazo('')
    carregar()
  }

  async function adicionarValor(id: string, valorAtual: number) {
    const valor = prompt('Quanto deseja adicionar a essa meta?')
    if (!valor) return
    await supabase.from('goals').update({ valor_atual: valorAtual + Number(valor) }).eq('id', id)
    carregar()
  }

  async function excluir(id: string) {
    await supabase.from('goals').delete().eq('id', id)
    carregar()
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Metas financeiras</h1>

        <form onSubmit={criar} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm">Nome da meta</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="text-sm">Valor objetivo</label>
            <input type="number" value={valorMeta} onChange={(e) => setValorMeta(e.target.value)} className="p-2 border rounded w-32" required />
          </div>
          <div>
            <label className="text-sm">Prazo</label>
            <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="p-2 border rounded" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded h-10">Criar meta</button>
        </form>

        <div className="space-y-4">
          {metas.map((m) => {
            const progresso = Math.min((Number(m.valor_atual) / Number(m.valor_meta)) * 100, 100)
            return (
              <div key={m.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{m.nome}</h3>
                    {m.prazo && <p className="text-xs text-gray-500">Prazo: {m.prazo}</p>}
                  </div>
                  <button onClick={() => excluir(m.id)} className="text-red-400 text-sm">Excluir</button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${progresso}%` }} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>R$ {Number(m.valor_atual).toFixed(2)} de R$ {Number(m.valor_meta).toFixed(2)}</span>
                  <button onClick={() => adicionarValor(m.id, Number(m.valor_atual))}
                    className="text-indigo-600 font-medium">+ Adicionar valor</button>
                </div>
              </div>
            )
          })}
          {metas.length === 0 && (
            <p className="text-center text-gray-500">Nenhuma meta cadastrada ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
