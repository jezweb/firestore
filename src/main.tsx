import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Suppress ResizeObserver loop limit exceeded error
const resizeObserverError = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends resizeObserverError {
  constructor(callback: ResizeObserverCallback) {
    super((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries)) return;
        callback(entries, observer);
      });
    });
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>
);
