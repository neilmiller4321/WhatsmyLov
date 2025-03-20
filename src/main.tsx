import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Add error handling for root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element. The app cannot be initialized.');
  // Create a fallback element to show an error message
  const fallbackElement = document.createElement('div');
  fallbackElement.style.padding = '20px';
  fallbackElement.style.fontFamily = 'sans-serif';
  fallbackElement.innerHTML = `
    <h1>Application Error</h1>
    <p>The application could not be initialized because the root element was not found.</p>
    <p>Please check your HTML file to ensure there is an element with id="root".</p>
  `;
  document.body.appendChild(fallbackElement);
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}