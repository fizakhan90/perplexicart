interface TradeoffsCardProps {
    tradeoffs?: string | null; 
}

export default function TradeoffsCard({ tradeoffs }: TradeoffsCardProps) {
  if (!tradeoffs) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-3xl">
      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
        Important Tradeoffs
      </h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{tradeoffs}</p>
    </div>
  );
}