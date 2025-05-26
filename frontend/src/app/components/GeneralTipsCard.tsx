import { Sparkles } from 'lucide-react';

interface GeneralTipsCardProps {
  tips?: string[] | null; 
}

export default function GeneralTipsCard({ tips }: GeneralTipsCardProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2" />
        Pro Shopping Tips
      </h3>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start">
            <div className="w-2 h-2 bg-slate-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
            <p className="text-slate-600 dark:text-slate-300">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}