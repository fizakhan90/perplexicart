"use client"

import { useState, type FormEvent, useEffect } from "react";

// Import Child Components (adjust paths if your components folder is different)
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggleButton from "./components/ThemeToggleButton";
import PerplexiCartHeader from "./components/PerplexiCartHeader";
import SearchForm from "./components/SearchForm";
import LoadingIndicator from "./components/LoadingIndicator";
import ErrorDisplay from "./components/ErrorDisplay";
import ResultsDisplay from "./components/ResultsDisplay";
import PerplexiCartFooter from "./components/PerplexiCartFooter";

// Import Types from the central types file
// Adjust path if your types folder is, e.g., at src/types/ then it would be something like '../../types'
// For this example, assuming types/index.ts is a sibling to the app folder, or SearchForm is in app/
// Let's assume `perplexi-cart-ui.tsx` is in `src/app/` and `types` is in `src/`
import { type AdviceResponse, type QueryRequest, type PriorityOption } from "../types"; 

// Import Data (priorities array and mockResponse)
// Assuming data.ts is in the same `src/app/` folder
import { priorities, mockResponse } from "./data"; 

export default function PerplexiCartUI() {
  const [query, setQuery] = useState<string>("");
  const [selectedPriorityValue, setSelectedPriorityValue] = useState<string>(priorities[0].value);
  const [results, setResults] = useState<AdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoIndicator, setShowDemoIndicator] = useState<boolean>(false); // For demo loading indicator
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [userContext, setUserContext] = useState<string>("");

  // --- Theme Management ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("perplexi-cart-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Fallback to system preference if no saved theme
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    localStorage.setItem("perplexi-cart-theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]); // Run when isDarkMode changes

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- API Call Logic (LIVE) ---
  const handleSearchSubmit = async () => { // No event needed if SearchForm calls this directly
    if (!query.trim()) {
      setError("Please enter what you want to buy.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    setShowDemoIndicator(false); // Ensure demo indicator is off for real search

    const requestBody: QueryRequest = {
      query: query,
      priority: selectedPriorityValue,
      user_context: userContext.trim() ? userContext.trim() : undefined,
    };

    try {
      const response = await fetch('http://localhost:8000/api/get-advice', { // Your FastAPI backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        let detailedError = `An unexpected error occurred. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          detailedError = errorData.detail || `HTTP error! Status: ${response.status}`;
          if (response.status === 400 && errorData.error && errorData.error.message) {
            detailedError = `Perplexity API Error: ${errorData.error.message}`;
          } else if (response.status === 504) {
               detailedError = "The request to Perplexity timed out. This may happen on first use or complex queries. Please try again.";
          }
        } catch (e) {
          detailedError = response.statusText || detailedError;
          console.warn("Could not parse error response as JSON:", e);
        }
        throw new Error(detailedError);
      }
      
      const data: AdviceResponse = await response.json();
      setResults(data);

    } catch (err: any) {
      console.error('API Call Failed:', err);
      setError(err.message || 'Failed to fetch advice. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Demo Logic ---
  const handleDemoClick = () => {
    setQuery("gaming laptop under $1000");
    setSelectedPriorityValue("best_value");
    setShowDemoIndicator(true); // Specifically for demo loading UI
    setIsLoading(true); // General loading state
    setError(null);
    setResults(null);
    setTimeout(() => {
      setResults(mockResponse);
      setIsLoading(false);
      setShowDemoIndicator(false);
    }, 1500);
  };

  // Find the full priority object for passing to components that need more than just the value
  const selectedPriorityFullData = priorities.find((p) => p.value === selectedPriorityValue);

  return (
    // The main div now correctly applies dark mode classes based on isDarkMode state
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors`}>
      <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <AnimatedBackground /> {/* Contains all background visual elements */}
      
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <PerplexiCartHeader />
        
        <main className="max-w-4xl mx-auto">
          <SearchForm
            query={query}
            setQuery={setQuery}
            selectedPriority={selectedPriorityValue} // Pass the string value
            setSelectedPriority={setSelectedPriorityValue} // Pass the setter for the string value
            priorities={priorities} // Pass the full array of priority options
            isLoading={isLoading}
            onSubmit={handleSearchSubmit} // Passed as a callback
            onDemoClick={handleDemoClick} // Passed as a callback
            userContext={""} setUserContext={function (value: string): void {
              throw new Error("Function not implemented.");
            } }          />

          {error && <ErrorDisplay error={error} />}
          {(isLoading || showDemoIndicator) && <LoadingIndicator />} 
          
          {/* Only show results if NOT loading AND results exist AND not in demo loading phase */}
          {results && !isLoading && !showDemoIndicator && (
            <ResultsDisplay results={results} selectedPriorityData={selectedPriorityFullData} />
          )}
        </main>
        
        <PerplexiCartFooter />
      </div>

      {/* Global styles for animations (like fadeIn) can remain here or move to globals.css */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Any other animations like 'float' or 'gradient' for AnimatedBackground should be
           defined within AnimatedBackground.tsx or in globals.css if truly global */
      `}</style>
    </div>
  );
}