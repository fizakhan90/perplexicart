interface OverallSummaryCardProps {
  summary?: string; 
}

export default function OverallSummaryCard({ summary }: OverallSummaryCardProps) {
  if (!summary) return null; 

  return (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-2 bg-slate-900 dark:bg-slate-100 rounded-full mr-3"></div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Research Summary</h2>
      </div>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{summary}</p>
    </div>
  );
}