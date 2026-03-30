import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ style = {} }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="btn-icon theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ color: 'rgba(255,255,255,0.7)', ...style }}
        >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
    );
};

export default ThemeToggle;
