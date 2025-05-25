// frontend/src/app/components/LoadingIndicator.tsx
// No props needed if this is the only loading state.
// If you had different loading messages, you might pass them as props.

export default function LoadingIndicator() {
  return (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 mb-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">Searching with Perplexity AI</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyzing products, reviews, and expert opinions
          </p>
        </div>
      </div>
    </div>
  );
}