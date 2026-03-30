import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

const getTimeBasedDefault = () => {
    const hour = new Date().getHours(); // 0–23
    // Dark:  before 7 AM (0–6)  or  from 7 PM onward (19–23)
    // Light: 7 AM – 6:59 PM (7–18)
    return (hour >= 7 && hour < 19) ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Saved preference always wins; fall back to time-based default
        return localStorage.getItem('theme') || getTimeBasedDefault();
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
