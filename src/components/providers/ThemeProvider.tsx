'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
    theme: 'light',
    toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const saved = localStorage.getItem('novrsoc-theme') as Theme | null;
        const resolved = saved ?? 'light';
        setTheme(resolved);
        document.documentElement.classList.toggle('dark', resolved === 'dark');
    }, []);

    const toggle = () => {
        setTheme(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('novrsoc-theme', next);
            document.documentElement.classList.toggle('dark', next === 'dark');
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
};
