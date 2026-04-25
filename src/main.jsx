import React, { Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard';
import ThemeToggle from './components/ThemeToggle';
import '../index.js';
import '../index.css';

const App = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
    );
};

// Mount the ThemeToggle into the static navbar
const themeToggleRoot = document.getElementById('theme-toggle-root');
if (themeToggleRoot) {
    ReactDOM.createRoot(themeToggleRoot).render(<App />);
}

// Mount the Lanyard component only on Desktop
const lanyardRoot = document.getElementById('lanyard-body-root');
if (lanyardRoot && window.innerWidth > 768) {
    ReactDOM.createRoot(lanyardRoot).render(
        <Suspense fallback={<div style={{ color: 'transparent' }}>Loading Lanyard...</div>}>
            <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} />
        </Suspense>
    );
}
