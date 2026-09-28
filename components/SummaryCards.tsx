export default function SummaryCards({ receitas, despesas, saldo }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
        <p className="text-sm">Receitas</p>
        <p className="text-xl font-bold text-green-700 dark:text-green-300">
          R$ {receitas.toFixed(2)}
        </p>
      </div>
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded-xl">
        <p className="text-sm">Despesas</p>
        <p className="text-xl font-bold text-red-700 dark:text-red-300">
          R$ {despesas.toFixed(2)}
        </p>
      </div>
      <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl">
        <p className="text-sm">Saldo</p>
        <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
          R$ {saldo.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
