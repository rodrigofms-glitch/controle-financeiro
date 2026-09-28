'use client'
import { supabase } from '@/lib/supabaseClient'

export default function TransactionList({ transacoes, onUpdate }: any) {
  async function excluir(id: string) {
    await supabase.from('transactions').delete().eq('id', id)
    onUpdate()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl divide-y">
      {transacoes.map((t: any) => (
        <div key={t.id} className="flex justify-between items-center p-3">
          <div>
            <p className="font-medium">{t.descricao || t.categories?.nome}</p>
            <p className="text-xs text-gray-500">{t.data} • {t.categories?.nome}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
              {t.tipo === 'receita' ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
            </span>
            <button onClick={() => excluir(t.id)} className="text-red-400 text-sm">Excluir</button>
          </div>
        </div>
      ))}
      {transacoes.length === 0 && (
        <p className="p-4 text-center text-gray-500">Nenhuma transação neste período.</p>
      )}
    </div>
  )
}
