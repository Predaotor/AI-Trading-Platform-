import yfinance as yf
from datetime import datetime
from typing import List, Optional
import pandas as pd

class StockService:
    def __init__(self):
        pass
    
    def get_stock_price(self, symbol: str) -> Optional[dict]:
        """Get current stock price for a given symbol."""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get current price
            hist = ticker.history(period="1d")
            if hist.empty:
                return None
            
            current_price = hist['Close'].iloc[-1]
            
            # Calculate 24h change
            if len(hist) >= 2:
                prev_price = hist['Close'].iloc[-2]
                change = current_price - prev_price
                change_percent = (change / prev_price) * 100
            else:
                change = 0
                change_percent = 0
            
            return {
                "symbol": symbol.upper(),
                "price": float(current_price),
                "change": float(change),
                "change_percent": float(change_percent),
                "volume": int(info.get('volume', 0)),
                "market_cap": float(info.get('marketCap', 0)),
                "last_updated": datetime.utcnow()
            }
        except Exception as e:
            print(f"Error fetching {symbol} stock price: {str(e)}")
            return None
    
    def get_multiple_stock_prices(self, symbols: List[str]) -> List[dict]:
        """Get prices for multiple stock symbols."""
        results = []
        for symbol in symbols:
            price_data = self.get_stock_price(symbol)
            if price_data:
                results.append(price_data)
        return results
    
    def get_popular_stocks(self) -> List[dict]:
        """Get prices for popular stocks."""
        popular_symbols = ["AAPL", "TSLA", "GOOGL", "MSFT", "AMZN", "META", "NVDA", "NFLX"]
        return self.get_multiple_stock_prices(popular_symbols)

# Global instance
stock_service = StockService() 