'use client'

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="size-10 flex items-center justify-center">
                <div className="size-5 md:size-6 animate-pulse bg-gray-200 dark:bg-zinc-700 rounded-full" />
            </div>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer size-10 rounded-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:text-zinc-400 dark:hover:text-orange-400 dark:hover:bg-orange-500/10 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {theme === "dark"
                ? <Sun strokeWidth={2} className="size-5 md:size-6" />
                : <Moon strokeWidth={2} className="size-5 md:size-6" />}
        </button>
    )
}
export default ThemeToggle;