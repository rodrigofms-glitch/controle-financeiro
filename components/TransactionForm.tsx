'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TransactionForm({ onAdded }: any) {
  const [tipo, setTipo] = useState('despesa')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categorias, setCategorias] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => { carregarCategorias() }, [tipo])

  async function carregarCategorias() {
    const { data } = await supabase.from('categories').select('*').eq('tipo', tipo)
    setCategorias(data || [])
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('transactions').insert({
      user_id: user?.id,
      tipo, valor: Number(valor), descricao,
      category_id: categoryId || null,
      data: new Date().toISOString().slice(0, 10),
    })
    setValor(''); setDescricao('')
    onAdded()
  }

  return (
    <form onSubmit={salvar} className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setTipo('despesa')}
          className={`flex-1 p-2 rounded ${tipo === 'despesa' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
          Despesa
        </button>
        <button type="button" onClick={() => setTipo('receita')}
          className={`flex-1 p-2 rounded ${tipo === 'receita' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
          Receita
        </button>
      </div>
      <input type="number" step="0.01" placeholder="Valor" value={valor}
        onChange={(e) => setValor(e.target.value)} className="w-full p-2 border rounded" required />
      <input placeholder="Descrição" value={descricao}
        onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 border rounded" />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Selecione a categoria</option>
        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <button className="w-full bg-indigo-600 text-white p-2 rounded">Salvar</button>
    </form>
  )
}
