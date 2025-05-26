import { ExternalLink, CheckCircle, type LucideIcon } from 'lucide-react';
import { type ProductInsight } from '../../types'; 

interface RecommendationCardProps {
  recommendation: ProductInsight;
  SelectedPriorityIcon?: LucideIcon; 
}

export default function RecommendationCard({ recommendation: rec, SelectedPriorityIcon }: RecommendationCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 hover:shadow-md transition-shadow duration-200">
      {/* Product Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-0">
          {rec.product_name}
        </h3>
        {rec.estimated_price_range && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2 rounded-xl">
            <span className="text-green-700 dark:text-green-300 font-semibold">
              {rec.estimated_price_range}
            </span>
          </div>
        )}
      </div>

      {/* Priority Match */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-2">
          {SelectedPriorityIcon && ( 
            <SelectedPriorityIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 mr-2" />
          )}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            Priority Match Analysis
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm">{rec.priority_match_analysis}</p>
      </div>

      {/* Reasoning */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Why This Product?</h4>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {rec.reasoning_summary}
        </p>
      </div>

      {/* Pros and Cons */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-2xl">
          <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Pros
          </h5>
          <ul className="space-y-2">
            {rec.pros.map((pro, i) => (
              <li key={i} className="text-slate-600 dark:text-slate-300 text-sm flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl">
          <h5 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center">
            <div className="w-4 h-4 border border-red-500 rounded-full mr-2"></div>
            Cons
          </h5>
          <ul className="space-y-2">
            {rec.cons.map((con, i) => (
              <li key={i} className="text-slate-600 dark:text-slate-300 text-sm flex items-start">
                <span className="text-red-500 mr-2 mt-0.5">•</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specifications */}
      {rec.key_specifications && Object.keys(rec.key_specifications).length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Specifications</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(rec.key_specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400 text-sm">{key}:</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Sentiment */}
      {rec.user_sentiment_summary && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">User Sentiment</h5>
          <p className="text-slate-600 dark:text-slate-300 text-sm italic">
            {`"${rec.user_sentiment_summary}"`} 
          </p>
        </div>
      )}

      {/* Sources */}
      {rec.cited_sources && rec.cited_sources.length > 0 && (
        <div>
          <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            Sources
          </h5>
          <div className="space-y-2">
            {rec.cited_sources.map((source, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium flex items-center transition-colors group"
                >
                  {source.title || source.url}
                  <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
                {source.snippet && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 italic">
                    {`"${source.snippet}"`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}