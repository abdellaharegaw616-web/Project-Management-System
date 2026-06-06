import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ className = '' }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
    >
      {darkMode ? (
        <>
          <Sun className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-gray-400 dark:text-slate-300" />
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      )}
    </button>
  );
}
