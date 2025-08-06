'use client';

import { useTheme } from 'next-themes';

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-white text-black border-none w-10 h-10 text-xl cursor-pointer transition-all duration-300 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-primary hover:text-black"
      aria-label="Toggle theme"
    >
      🌓
    </button>
  );
};
