import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard';
import '../index.js';
import '../index.css';

// Mount the Lanyard component
const lanyardRoot = document.getElementById('lanyard-root');
if (lanyardRoot) {
    ReactDOM.createRoot(lanyardRoot).render(
        <Suspense fallback={<div style={{ color: 'transparent' }}>Loading Lanyard...</div>}>
            <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} />
        </Suspense>
    );
}
