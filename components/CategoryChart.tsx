'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function CategoryChart({ transacoes }: any) {
  const despesas = transacoes.filter((t: any) => t.tipo === 'despesa')
  const porCategoria: Record<string, number> = {}

  despesas.forEach((t: any) => {
    const nome = t.categories?.nome || 'Sem categoria'
    porCategoria[nome] = (porCategoria[nome] || 0) + Number(t.valor)
  })

  const data = Object.entries(porCategoria).map(([nome, valor]) => ({ nome, valor }))
  const cores = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

  if (data.length === 0) return <p className="text-sm text-gray-500">Sem despesas registradas neste mês.</p>

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
      <h2 className="font-bold mb-2">Despesas por categoria</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="valor" nameKey="nome" outerRadius={90} label>
            {data.map((_, i) => <Cell key={i} fill={cores[i % cores.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
