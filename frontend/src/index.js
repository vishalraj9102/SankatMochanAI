import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import your global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ensure that the 'root' element exists in your index.html
const rootElement = document.getElementById('root');

// Check if the element exists, then create the root and render the app
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
