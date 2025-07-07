export const AppConfig = {
  site_name: 'CryptoBot Pro',
  title: 'CryptoBot Pro - Automated Trading Platform',
  description:
    'Advanced AI-powered trading bot that analyzes market trends and executes trades automatically.',
  locale: 'en',

  // Backend API base URL - use Vite environment variable
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
};

// Debug: Log the API URL being used
console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000');
