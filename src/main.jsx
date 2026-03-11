import React, { Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard';
import PillNav from './components/PillNav';
import '../index.js';
import '../index.css';

const AppNav = () => {
    const [activeSection, setActiveSection] = useState('#home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'projects', 'about', 'contact'];
            let current = '';

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = `#${section}`;
                        break;
                    }
                }
            }
            if (current && current !== activeSection) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    return (
        <div style={{ pointerEvents: 'auto' }}>
            <PillNav
                logo="/images/favicon.png"
                logoAlt="Sriram Logo"
                items={[
                    { label: 'Home', href: '#home' },
                    { label: 'Projects', href: '#projects' },
                    { label: 'About', href: '#about' },
                    { label: 'Contact', href: '#contact' },
                    { label: 'Academic', href: 'academic/index.html' }
                ]}
                activeHref={activeSection}
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                theme="light"
                initialLoadAnimation={true}
            />
        </div>
    );
};

// Mount the Lanyard component
const lanyardRoot = document.getElementById('lanyard-root');
if (lanyardRoot) {
    ReactDOM.createRoot(lanyardRoot).render(
        <Suspense fallback={<div style={{ color: 'transparent' }}>Loading Lanyard...</div>}>
            <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} />
        </Suspense>
    );
}
