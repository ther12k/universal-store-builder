
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set up theme from localStorage or default to light
document.documentElement.setAttribute('data-theme', 
  localStorage.getItem('theme') || 'light'
);

createRoot(document.getElementById("root")!).render(<App />);
