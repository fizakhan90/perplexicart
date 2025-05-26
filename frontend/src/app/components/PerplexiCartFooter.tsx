import { Zap } from 'lucide-react';

export default function PerplexiCartFooter() {
  return (
    <footer className="text-center mt-16 text-slate-500 dark:text-slate-400">
      <div className="flex items-center justify-center mb-2">
        <Zap className="w-4 h-4 mr-1" />
        <span>Powered by Perplexity AI</span>
      </div>
      <p className="text-sm">© {new Date().getFullYear()} PerplexiCart. Smart shopping decisions made simple.</p>
    </footer>
  );
}