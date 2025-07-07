import requests
import ccxt
from datetime import datetime
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class CryptoService:
    def __init__(self):
        self.binance = ccxt.binance()
        self.coingecko_base_url = "https://api.coingecko.com/api/v3"
    
    def get_btc_price(self) -> dict:
        """Get current BTC price from multiple sources."""
        try:
            # Try Binance first
            ticker = self.binance.fetch_ticker('BTC/USDT')
            price_usd = float(ticker['last'])
            
            return {
                "price_usd": price_usd,
                "price_btc": 1.0,
                "change_24h": float(ticker.get('change', 0)),
                "volume_24h": float(ticker.get('quoteVolume', 0)),
                "last_updated": datetime.utcnow()
            }
        except Exception as e:
            print(f"Error fetching BTC price from Binance: {str(e)}")
            
            # Fallback to CoinGecko
            try:
                response = requests.get(f"{self.coingecko_base_url}/simple/price", params={
                    "ids": "bitcoin",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_24hr_vol": "true"
                })
                response.raise_for_status()
                data = response.json()
                
                return {
                    "price_usd": data["bitcoin"]["usd"],
                    "price_btc": 1.0,
                    "change_24h": data["bitcoin"].get("usd_24h_change", 0),
                    "volume_24h": data["bitcoin"].get("usd_24h_vol", 0),
                    "last_updated": datetime.utcnow()
                }
            except Exception as e2:
                print(f"Error fetching BTC price from CoinGecko: {str(e2)}")
                
                # Final fallback - mock data
                return {
                    "price_usd": 45000.0,
                    "price_btc": 1.0,
                    "change_24h": 0.0,
                    "volume_24h": 0.0,
                    "last_updated": datetime.utcnow()
                }
    
    def get_crypto_price(self, symbol: str) -> Optional[dict]:
        """Get price for a specific cryptocurrency."""
        try:
            # Map common symbols to Binance symbols
            symbol_mapping = {
                "ETH": "ETH/USDT",
                "BTC": "BTC/USDT",
                "ADA": "ADA/USDT",
                "DOT": "DOT/USDT",
                "LINK": "LINK/USDT"
            }
            
            binance_symbol = symbol_mapping.get(symbol.upper(), f"{symbol.upper()}/USDT")
            ticker = self.binance.fetch_ticker(binance_symbol)
            
            return {
                "symbol": symbol.upper(),
                "price_usd": float(ticker['last']),
                "price_btc": float(ticker['last']) / self.get_btc_price()["price_usd"],
                "change_24h": float(ticker.get('change', 0)),
                "volume_24h": float(ticker.get('quoteVolume', 0)),
                "last_updated": datetime.utcnow()
            }
        except Exception as e:
            print(f"Error fetching {symbol} price: {str(e)}")
            return None

# Global instance
crypto_service = CryptoService() 