// frontend/src/app/components/ThemeToggleButton.tsx
'use client'; // Uses onClick
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleButtonProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggleButton({ isDarkMode, toggleTheme }: ThemeToggleButtonProps) {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${isDarkMode ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-slate-600 transition-all duration-300 ${isDarkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
        />
      </div>
    </button>
  );
}