"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme] = useState<Theme>("light");

    useEffect(() => {
        // Force light mode
        document.documentElement.classList.remove("dark");
    }, []);

    const toggleTheme = () => {
        // No-op
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
