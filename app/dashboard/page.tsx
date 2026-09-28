'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SummaryCards from '@/components/SummaryCards'
import CategoryChart from '@/components/CategoryChart'
import TransactionList from '@/components/TransactionList'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState<any[]>([])
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())

  useEffect(() => { carregar() }, [mes, ano])

  async function carregar() {
    const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`
    const fim = `${ano}-${String(mes).padStart(2, '0')}-31`
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(nome, cor)')
      .gte('data', inicio)
      .lte('data', fim)
      .order('data', { ascending: false })
    setTransacoes(data || [])
  }

  const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((s, t) => s + Number(t.valor), 0)
  const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((s, t) => s + Number(t.valor), 0)
  const saldo = receitas - despesas

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex gap-2 items-center">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="p-2 border rounded">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <input type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))}
            className="p-2 border rounded w-24" />
        </div>

        <SummaryCards receitas={receitas} despesas={despesas} saldo={saldo} />
        <CategoryChart transacoes={transacoes} />
        <TransactionList transacoes={transacoes} onUpdate={carregar} />
      </div>
    </div>
  )
}
