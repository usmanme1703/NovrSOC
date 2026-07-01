'use client';

import { createContext, useContext } from 'react';

const ThemeContext = createContext<{ theme: 'light'; toggle: () => void }>({
    theme: 'light',
    toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
    <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>
        {children}
    </ThemeContext.Provider>
);
