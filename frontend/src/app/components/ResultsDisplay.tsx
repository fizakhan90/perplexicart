// frontend/src/app/components/ResultsDisplay.tsx
import { Star as StarIcon } from 'lucide-react'; // Renamed Star to avoid conflict if needed
import OverallSummaryCard from './OverallSummaryCard';
import RecommendationCard from './RecommendationCard';
import TradeoffsCard from './TradeoffsCard';
import GeneralTipsCard from './GeneralTipsCard';
import { type AdviceResponse, type PriorityOption } from '../../types'; // Adjust path as needed

interface ResultsDisplayProps {
  results: AdviceResponse;
  selectedPriorityData?: PriorityOption; // This contains the icon for the selected priority
}


export default function ResultsDisplay({ results, selectedPriorityData }: ResultsDisplayProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <OverallSummaryCard summary={results.overall_search_summary} />

      {results.recommendations && results.recommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <StarIcon className="w-6 h-6 text-amber-500 mr-2" />
            Top Recommendations
          </h2>
          {results.recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              recommendation={rec}
              SelectedPriorityIcon={selectedPriorityData?.icon} // Pass the icon component
            />
          ))}
        </div>
      )}

      <TradeoffsCard tradeoffs={results.tradeoffs_explained} />
      <GeneralTipsCard tips={results.general_tips} />
    </div>
  );
}