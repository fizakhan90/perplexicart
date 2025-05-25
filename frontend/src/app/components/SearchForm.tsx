// frontend/src/app/components/SearchForm.tsx
"use client";

import { type FormEvent } from "react"; // Keep if your main handler expects it, otherwise remove
import { Search, ArrowRight, type LucideIcon } from "lucide-react"; // Add ALL icons used here
import { type PriorityOption } from "../../types"; // Assuming types are in src/types
// (You might not need to import Star, Leaf etc. here if PriorityOption type includes the icon component directly)

interface SearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  selectedPriority: string; // This is the value string
  setSelectedPriority: (value: string) => void;
  priorities: PriorityOption[]; // Array of full priority objects
  isLoading: boolean;
  onSubmit: () => void; // Simplified: parent handles event prevention if needed
  onDemoClick: () => void;
  userContext: string; 
  setUserContext: (value: string) => void; 
}

export default function SearchForm({
  query,
  setQuery,
  selectedPriority,
  setSelectedPriority,
  priorities,
  isLoading,
  onSubmit,
  onDemoClick,
  userContext, 
  setUserContext,
}: SearchFormProps) {
  // If your parent handleSubmit in PerplexiCartUI still needs FormEvent
  const triggerSubmit = () => {
    onSubmit(); // If the parent handleSubmit was simplified to not need an event
    // OR if parent handleSubmit still expects an event (though not ideal if called from here):
    // onSubmit({} as FormEvent<HTMLFormElement>);
  };

  return (
    // ===== COPY THE EXACT JSX FROM YOUR MONOLITHIC FILE'S SEARCH FORM SECTION HERE =====
    // ===== AND THEN ADAPT IT TO USE THE PROPS LISTED ABOVE                   =====
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 mb-12 shadow-sm">
      <div className="space-y-8">
        {/* Search Input */}
        <div className="space-y-3">
          <label htmlFor="query" className="block text-lg font-semibold text-slate-900 dark:text-slate-100">
            What are you looking to buy?
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              id="query"
              value={query} // USE PROP
              onChange={(e) => setQuery(e.target.value)} // USE PROP
              placeholder="e.g., gaming laptop under $1000, organic sunscreen for sensitive skin"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent outline-none placeholder-slate-400 text-slate-900 dark:text-slate-100 text-base transition-all duration-200" // Explicit text colors
              required
            />
          </div>
        </div>

        {/* Priority Selection */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-slate-900 dark:text-slate-100">
            Choose your priority:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {priorities.map((priorityOption) => { // USE priorities PROP
              const IconComponent = priorityOption.icon;
              const isSelected = selectedPriority === priorityOption.value; // USE selectedPriority PROP
              return (
                <button
                  key={priorityOption.value}
                  type="button"
                  onClick={() => setSelectedPriority(priorityOption.value)} // USE setSelectedPriority PROP
                  className={`group text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-100 dark:bg-slate-800"} transition-colors duration-200`}
                    >
                      <IconComponent // RENDER THE ICON COMPONENT
                        className={`w-4 h-4 ${isSelected ? "text-slate-100 dark:text-slate-900" : "text-slate-600 dark:text-slate-400"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold text-sm ${isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {priorityOption.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {priorityOption.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="userContext" className="block text-lg font-semibold text-slate-900 dark:text-slate-100">
            Any specific needs or context? (Optional)
          </label>
          <textarea
            id="userContext"
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            placeholder="e.g., My skin is oily and acne-prone. I live in a very humid city. I prefer products without strong fragrances."
            rows={3}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent outline-none placeholder-slate-400 text-slate-900 dark:text-slate-100 text-base transition-all duration-200"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Helps PerplexiCart give you more tailored advice (e.g., skin type, allergies, location affecting product use).
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={triggerSubmit} // USE onSubmit PROP (via triggerSubmit if needed)
          disabled={isLoading}    // USE isLoading PROP
          className="group w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
              Analyzing with Perplexity AI...
            </>
          ) : (
            <>
              Get Smart Shopping Advice
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>

        {/* Demo Button */}
        <div className="text-center">
          <button
            onClick={onDemoClick} // USE onDemoClick PROP
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors duration-200"
          >
            Try Demo: Gaming Laptop Search →
          </button>
        </div>
      </div>
    </div>
  );
}