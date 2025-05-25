"use client"

// Moved useState and useEffect to be after 'use client' and before other imports for convention
import { useState, useEffect } from "react"; 
// Removed FormEvent as it's not used directly in this component's handlers now

// Import Child Components
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggleButton from "./components/ThemeToggleButton";
import PerplexiCartHeader from "./components/PerplexiCartHeader";
import SearchForm from "./components/SearchForm";
import LoadingIndicator from "./components/LoadingIndicator";
import ErrorDisplay from "./components/ErrorDisplay";
import ResultsDisplay from "./components/ResultsDisplay";
import PerplexiCartFooter from "./components/PerplexiCartFooter";

// Import Types
import { type AdviceResponse, type QueryRequest, type PriorityOption } from "../types"; 

// Import Data
import { priorities, mockResponse } from "./data"; 

export default function PerplexiCartUI() {
  const [query, setQuery] = useState<string>("");
  const [selectedPriorityValue, setSelectedPriorityValue] = useState<string>(priorities[0].value);
  const [results, setResults] = useState<AdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoIndicator, setShowDemoIndicator] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [userContext, setUserContext] = useState<string>(""); // State for user context

  // --- Theme Management ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("perplexi-cart-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("perplexi-cart-theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- API Call Logic (LIVE) ---
  const handleSearchSubmit = async () => {
    // API_BASE_URL accessed here, inside the function that uses it
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    if (!query.trim()) {
      setError("Please enter what you want to buy.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    setShowDemoIndicator(false);

    const requestBody: QueryRequest = {
      query: query,
      priority: selectedPriorityValue,
      user_context: userContext.trim() ? userContext.trim() : undefined,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/get-advice`, {
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

    } catch (err) { // Changed from err: any
      console.error('API Call Failed:', err);
      if (err instanceof Error) { // Type check for err
        setError(err.message || 'Failed to fetch advice. Please check the console for more details.');
      } else {
        setError('An unknown error occurred while fetching advice.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Demo Logic ---
  const handleDemoClick = () => {
    setQuery("gaming laptop under $1000");
    setSelectedPriorityValue("best_value");
    setUserContext(""); // Reset context for demo if needed
    setShowDemoIndicator(true);
    setIsLoading(true);
    setError(null);
    setResults(null);
    setTimeout(() => {
      setResults(mockResponse);
      setIsLoading(false);
      setShowDemoIndicator(false);
    }, 1500);
  };

  // This line uses PriorityOption, so the import is necessary
  const selectedPriorityFullData: PriorityOption | undefined = priorities.find(
    (p) => p.value === selectedPriorityValue
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors`}>
      <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <AnimatedBackground />
      
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <PerplexiCartHeader />
        
        <main className="max-w-4xl mx-auto">
          <SearchForm
            query={query}
            setQuery={setQuery}
            selectedPriority={selectedPriorityValue}
            setSelectedPriority={setSelectedPriorityValue}
            priorities={priorities}
            isLoading={isLoading}
            onSubmit={handleSearchSubmit}
            onDemoClick={handleDemoClick}
            userContext={userContext}       // Pass the state
            setUserContext={setUserContext} // Pass the state setter
          />

          {error && <ErrorDisplay error={error} />}
          {(isLoading || showDemoIndicator) && <LoadingIndicator />} 
          
          {results && !isLoading && !showDemoIndicator && (
            <ResultsDisplay results={results} selectedPriorityData={selectedPriorityFullData} />
          )}
        </main>
        
        <PerplexiCartFooter />
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}