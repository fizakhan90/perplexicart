// frontend/src/app/components/PerplexiCartHeader.tsx
import { ShoppingCart, TrendingUp, Award, CheckCircle } from 'lucide-react';

export default function PerplexiCartHeader() {
  return (
    <header className="text-center mb-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-900 dark:bg-slate-100 rounded-2xl">
            <ShoppingCart className="w-8 h-8 text-slate-100 dark:text-slate-900" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">PerplexiCart</h1>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI-powered shopping advisor that cuts through the noise to help you make informed purchasing decisions.
        </p>

        <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Smart Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Expert Reviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Sources</span>
          </div>
        </div>
      </div>
    </header>
  );
}