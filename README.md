# CryptoBot Pro - Full Stack Trading Platform

A modern full-stack cryptocurrency and stock trading platform built with FastAPI, React, and TypeScript. This project features a real-time trading dashboard with live price feeds, automated bot controls, and a comprehensive trading interface.

## 🚀 Recent Updates & Improvements

### Frontend Enhancements (Latest Changes)
- **Removed All Mock Data**: Completely eliminated hardcoded data from all components
- **Real API Integration**: All components now fetch live data from backend endpoints
- **Enhanced Error Handling**: Graceful error states when backend endpoints are unavailable
- **Authentication Context**: Proper user authentication flow with JWT tokens
- **Error Boundaries**: Added error boundary components to prevent white screens
- **Responsive Design**: Mobile-friendly interface with proper loading states
- **Live Data Components**: 
  - Real-time stock prices from backend API
  - Live BTC price updates
  - User wallet balance integration
  - Trading interface with swap functionality

### Backend Features
- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Bitcoin Wallet Management**: Secure wallet creation and balance tracking
- **Real-time Price Data**: Live BTC and stock prices from multiple APIs
- **Background Tasks**: Automatic price updates every 60 seconds
- **Database**: PostgreSQL/SQLite with SQLAlchemy ORM and Alembic migrations
- **CORS Enabled**: Frontend integration ready

## 📁 Project Structure

```
AI agent/
├── ETH-backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── models/             # Database models (User, Wallet)
│   │   ├── routes/             # API endpoints (auth, crypto, stocks, user)
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic (crypto, background tasks)
│   │   ├── utils/              # Utilities (auth, bitcoin)
│   │   ├── database.py         # DB configuration
│   │   └── main.py             # FastAPI app
│   ├── alembic/                # Database migrations
│   ├── requirements.txt        # Python dependencies
│   ├── alembic.ini            # Alembic configuration
│   └── venv/                  # Virtual environment
│
├── ETH-frontend/               # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   ├── BTCPrice.tsx   # Live BTC price display
│   │   │   ├── StockPrices.tsx # Real-time stock prices
│   │   │   ├── WalletBalance.tsx # User wallet balance
│   │   │   ├── TradingInterface.tsx # Trading interface
│   │   │   ├── BotControls.tsx # Bot control panel
│   │   │   └── ErrorBoundary.tsx # Error handling
│   │   ├── context/           # React context (AuthContext)
│   │   ├── pages/             # Page components
│   │   ├── utils/             # API utilities
│   │   └── App.tsx            # Main app
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── components.json        # Shadcn/ui configuration
│
├── README.md                  # This file
├── start.sh                   # Development startup script
└── model.txt                  # AI model configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd ETH-backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**:
   ```bash
   # Create initial migration
   alembic revision --autogenerate -m "Initial migration"
   
   # Apply migrations
   alembic upgrade head
   ```

6. **Run the backend**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd ETH-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3001` (or next available port)

### Quick Start (Both Services)
Use the provided startup script:
```bash
./start.sh
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT token)
- `GET /auth/profile` - Get user profile (requires JWT)

### User & Wallet
- `GET /user/{id}/balance` - Get user wallet balance
- `GET /user/{id}/wallets` - Get user wallets

### Cryptocurrency
- `GET /crypto/btc-price` - Get current BTC price
- `GET /crypto/price/{symbol}` - Get crypto price by symbol
- `GET /crypto/pairs` - Get available crypto pairs

### Stocks
- `GET /stocks/prices?tickers=AAPL,TSLA` - Get stock prices
- `GET /stocks/price/{symbol}` - Get specific stock price
- `GET /stocks/popular` - Get popular stocks

### Trading (Planned)
- `GET /trading/recent-trades/{user_id}` - Get recent trades
- `POST /trading/swap` - Execute token swap
- `GET /trading/quote` - Get swap quote

### Dashboard (Planned)
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/last-update` - Get last update time
- `GET /dashboard/active-trades` - Get active trades
- `GET /dashboard/success-rate` - Get trading success rate

## 🎯 Key Features

### Real-time Data
- **BTC Price**: Live Bitcoin price from Binance/CoinGecko
- **Stock Prices**: Real-time stock data from yfinance
- **Auto-refresh**: Prices update every 30-60 seconds
- **Caching**: Background tasks cache prices for performance

### Frontend Components
- **Live Price Feeds**: Real-time BTC and stock price displays
- **User Dashboard**: Personal trading dashboard with statistics
- **Trading Interface**: Token swap interface with quote system
- **Bot Controls**: Automated trading bot control panel
- **Error Handling**: Graceful error states and error boundaries
- **Responsive Design**: Mobile-friendly interface

### Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Encrypted Wallets**: Private keys encrypted at rest
- **CORS Protection**: Configured for frontend integration

### Bitcoin Integration
- **Wallet Creation**: Automatic wallet generation per user
- **Balance Tracking**: Real-time BTC balance updates
- **Secure Storage**: Encrypted private key storage
- **Multiple Wallets**: Support for multiple wallets per user

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `ETH-backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./cryptobot.db

# Security
SECRET_KEY=your-super-secret-key-change-in-production
WALLET_ENCRYPTION_KEY=your-wallet-encryption-key-change-in-production

# API Keys (optional)
BINANCE_API_KEY=your-binance-api-key
BINANCE_SECRET_KEY=your-binance-secret-key

# Environment
ENVIRONMENT=development
DEBUG=true
```

### Vite Proxy (Frontend)

The frontend is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

## 📝 Development Notes

### Recent Changes Made

1. **Frontend API Integration**:
   - Removed all hardcoded mock data
   - Implemented real API calls for all components
   - Added proper error handling for missing endpoints
   - Created comprehensive API utility functions

2. **Component Updates**:
   - `StockPrices.tsx`: Now fetches real stock data from backend
   - `BTCPrice.tsx`: Live BTC price from backend API
   - `WalletBalance.tsx`: Real user balance integration
   - `TradingInterface.tsx`: Complete trading interface with swap functionality
   - `Index.tsx`: Dashboard with real-time statistics

3. **Error Handling**:
   - Added `ErrorBoundary` component to prevent white screens
   - Graceful error states for missing backend endpoints
   - User-friendly error messages
   - Loading states for all async operations

4. **Authentication**:
   - Fixed `AuthProvider` wrapping in main.tsx
   - Proper JWT token handling
   - User context throughout the application

### Adding New Features
1. **Backend**: Add routes in `app/routes/`, models in `app/models/`
2. **Frontend**: Create components in `src/components/`
3. **API**: Update `src/utils/api.ts` for new endpoints

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy with uvicorn/gunicorn

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure API proxy for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Disclaimer

**Please read the [DISCLAIMER.md](DISCLAIMER.md) file before using this software.**

This project is for educational and demonstration purposes only. Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. This software does not constitute financial advice.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

## 🔄 Version History

### Latest Version
- Complete removal of mock data
- Real API integration for all components
- Enhanced error handling and user experience
- Mobile-responsive design improvements
- Authentication flow fixes

### Previous Versions
- Initial project setup with FastAPI and React
- Basic authentication and wallet management
- Real-time price feeds implementation 