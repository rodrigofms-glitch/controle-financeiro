'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

export default function Cartoes() {
  const [cartoes, setCartoes] = useState<any[]>([])
  const [compras, setCompras] = useState<any[]>([])
  const [cartaoSelecionado, setCartaoSelecionado] = useState<string | null>(null)

  const [nome, setNome] = useState('')
  const [limite, setLimite] = useState('')
  const [fechamento, setFechamento] = useState('1')
  const [vencimento, setVencimento] = useState('10')

  const [descCompra, setDescCompra] = useState('')
  const [valorCompra, setValorCompra] = useState('')
  const [parcelas, setParcelas] = useState('1')

  useEffect(() => { carregarCartoes() }, [])
  useEffect(() => { if (cartaoSelecionado) carregarCompras() }, [cartaoSelecionado])

  async function carregarCartoes() {
    const { data } = await supabase.from('credit_cards').select('*').order('nome')
    setCartoes(data || [])
    if (data && data.length > 0 && !cartaoSelecionado) setCartaoSelecionado(data[0].id)
  }

  async function carregarCompras() {
    const { data } = await supabase
      .from('credit_card_transactions')
      .select('*')
      .eq('card_id', cartaoSelecionado)
      .order('data', { ascending: false })
    setCompras(data || [])
  }

  async function criarCartao(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('credit_cards').insert({
      user_id: user?.id, nome, limite: Number(limite),
      dia_fechamento: Number(fechamento), dia_vencimento: Number(vencimento),
    })
    setNome(''); setLimite('')
    carregarCartoes()
  }

  async function excluirCartao(id: string) {
    await supabase.from('credit_cards').delete().eq('id', id)
    setCartaoSelecionado(null)
    carregarCartoes()
  }

  async function adicionarCompra(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('credit_card_transactions').insert({
      user_id: user?.id, card_id: cartaoSelecionado,
      descricao: descCompra, valor: Number(valorCompra), parcelas: Number(parcelas),
    })
    setDescCompra(''); setValorCompra(''); setParcelas('1')
    carregarCompras()
  }

  async function excluirCompra(id: string) {
    await supabase.from('credit_card_transactions').delete().eq('id', id)
    carregarCompras()
  }

  const cartaoAtual = cartoes.find((c) => c.id === cartaoSelecionado)
  const totalFatura = compras.reduce((s, c) => s + Number(c.valor), 0)

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Cartões de crédito</h1>

        <form onSubmit={criarCartao} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-sm">Nome do cartão</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} className="p-2 border rounded" required />
          </div>
          <div>
            <label className="text-sm">Limite</label>
            <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} className="p-2 border rounded w-28" required />
          </div>
          <div>
            <label className="text-sm">Dia fechamento</label>
            <input type="number" min="1" max="31" value={fechamento} onChange={(e) => setFechamento(e.target.value)} className="p-2 border rounded w-20" />
          </div>
          <div>
            <label className="text-sm">Dia vencimento</label>
            <input type="number" min="1" max="31" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className="p-2 border rounded w-20" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded h-10">Criar cartão</button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {cartoes.map((c) => (
            <button key={c.id} onClick={() => setCartaoSelecionado(c.id)}
              className={`px-4 py-2 rounded-full text-sm ${cartaoSelecionado === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {c.nome}
            </button>
          ))}
        </div>

        {cartaoAtual && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold">{cartaoAtual.nome}</h2>
                <p className="text-sm text-gray-500">
                  Limite: R$ {Number(cartaoAtual.limite).toFixed(2)} • Fecha dia {cartaoAtual.dia_fechamento} • Vence dia {cartaoAtual.dia_vencimento}
                </p>
              </div>
              <button onClick={() => excluirCartao(cartaoAtual.id)} className="text-red-400 text-sm">
                Excluir cartão
              </button>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg">
              <p className="text-sm">Fatura atual</p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                R$ {totalFatura.toFixed(2)}
              </p>
            </div>

            <form onSubmit={adicionarCompra} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm">Descrição</label>
                <input value={descCompra} onChange={(e) => setDescCompra(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="text-sm">Valor</label>
                <input type="number" step="0.01" value={valorCompra} onChange={(e) => setValorCompra(e.target.value)} className="p-2 border rounded w-28" required />
              </div>
              <div>
                <label className="text-sm">Parcelas</label>
                <input type="number" min="1" value={parcelas} onChange={(e) => setParcelas(e.target.value)} className="p-2 border rounded w-20" />
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded h-10">Adicionar compra</button>
            </form>

            <div className="divide-y">
              {compras.map((c) => (
                <div key={c.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{c.descricao}</p>
                    <p className="text-xs text-gray-500">{c.parcelas}x • {c.data}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>R$ {Number(c.valor).toFixed(2)}</span>
                    <button onClick={() => excluirCompra(c.id)} className="text-red-400 text-sm">Excluir</button>
                  </div>
                </div>
              ))}
              {compras.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma compra nesse cartão.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
