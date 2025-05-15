
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set up theme from localStorage or default to light
document.documentElement.setAttribute('data-theme', 
  localStorage.getItem('theme') || 'light'
);

// Apply no-scroll-animations class if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('no-scroll-animations');
}

createRoot(document.getElementById("root")!).render(<App />);
