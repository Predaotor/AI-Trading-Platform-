import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

console.log('🚀 CryptoBot Pro Frontend is loading...');

try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    console.log('✅ React app rendered successfully');
  } else {
    console.error('❌ Root element not found');
  }
} catch (error) {
  console.error('❌ Error rendering React app:', error);
}
