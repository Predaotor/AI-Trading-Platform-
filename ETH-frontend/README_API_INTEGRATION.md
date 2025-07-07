# API Integration Documentation

## Overview
This document describes the changes made to remove hardcoded data and connect the frontend components to the backend APIs.

## Components Updated

### 1. StockPrices.tsx
- **Removed**: All hardcoded mock stock data
- **Added**: Proper API integration with `stocksAPI.getStockPrices()`
- **Features**: 
  - Fetches real stock prices for AAPL, TSLA, GOOGL, MSFT, AMZN
  - Auto-refreshes every 60 seconds
  - Proper error handling with fallback to empty state
  - Displays loading states during API calls

### 2. BTCPrice.tsx
- **Removed**: All hardcoded mock BTC price data
- **Added**: Proper API integration with `cryptoAPI.getBTCPrice()`
- **Features**:
  - Fetches real Bitcoin price data
  - Auto-refreshes every 30 seconds
  - Proper error handling with fallback to empty state
  - Displays loading states during API calls

### 3. UserBalance.tsx
- **Removed**: All hardcoded mock balance data
- **Added**: Proper API integration with `userAPI.getBalance()`
- **Features**:
  - Uses auth context to get current user ID
  - Fetches real user balance data
  - Manual refresh functionality
  - Proper error handling with retry button

### 4. WalletBalance.tsx
- **Removed**: All hardcoded mock wallet data
- **Added**: Proper API integration with `userAPI.getWallets()`
- **Features**:
  - Uses auth context to get current user ID
  - Fetches real wallet data
  - Transforms backend response to match component expectations
  - Proper error handling

## API Endpoints Used

### Stock Prices
- **Endpoint**: `GET /api/stocks/prices?tickers=AAPL,TSLA,GOOGL,MSFT,AMZN`
- **Response**: `StockPricesResponse` with array of `StockPriceResponse`

### Bitcoin Price
- **Endpoint**: `GET /api/crypto/btc-price`
- **Response**: `BTCPriceResponse` with price, change, volume data

### User Balance
- **Endpoint**: `GET /api/user/{user_id}/balance`
- **Response**: `BalanceResponse` with BTC and USD balances

### User Wallets
- **Endpoint**: `GET /api/user/{user_id}/wallets`
- **Response**: Array of `WalletResponse` objects

## Authentication
- Components now use the `useAuth()` hook to get the current user ID
- Fallback to user ID 1 for demo purposes if no authenticated user
- API calls include JWT tokens from localStorage when required

## Error Handling
- All components now show proper error states instead of falling back to mock data
- Loading states are displayed during API calls
- Retry functionality is available where appropriate
- Empty states are shown when no data is available

## Testing
To test the components:

1. **Start the backend**:
   ```bash
   cd ETH-backend
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend**:
   ```bash
   cd ETH-frontend
   npm run dev
   ```

3. **Verify API endpoints**:
   - Check that the proxy is working: `http://localhost:3000/api/health`
   - Test stock prices: `http://localhost:3000/api/stocks/prices?tickers=AAPL`
   - Test BTC price: `http://localhost:3000/api/crypto/btc-price`

4. **Check component behavior**:
   - Components should show loading states initially
   - Real data should appear after API calls complete
   - Error states should appear if backend is not running
   - Auto-refresh should work for stock and BTC prices

## Notes
- The backend must be running for the components to display real data
- If the backend is not available, components will show error states
- User authentication is required for balance and wallet data
- Stock and crypto prices are publicly accessible 