'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([])
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [busca, setBusca] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(nome, cor)')
      .order('data', { ascending: false })
    setTransacoes(data || [])
  }

  const filtradas = transacoes.filter((t) => {
    const passaTipo = filtroTipo === 'todos' || t.tipo === filtroTipo
    const passaBusca = t.descricao?.toLowerCase().includes(busca.toLowerCase())
      || t.categories?.nome?.toLowerCase().includes(busca.toLowerCase())
    return passaTipo && (busca === '' || passaBusca)
  })

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Transações</h1>

        <TransactionForm onAdded={carregar} />

        <div className="flex flex-wrap gap-3 items-center">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
            className="p-2 border rounded">
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <input placeholder="Buscar por descrição ou categoria..." value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="p-2 border rounded flex-1 min-w-[200px]" />
        </div>

        <TransactionList transacoes={filtradas} onUpdate={carregar} />
      </div>
    </div>
  )
}
