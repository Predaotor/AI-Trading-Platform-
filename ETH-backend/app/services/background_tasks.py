import asyncio
import threading
import time
from datetime import datetime
from typing import Dict, Any
from app.services.crypto_service import crypto_service
from app.services.stock_service import stock_service

# Global cache for prices
price_cache: Dict[str, Any] = {
    "btc_price": None,
    "stock_prices": {},
    "last_updated": None
}

# Background task control
background_task_running = False
background_thread = None

def update_prices():
    """Update all prices in the cache."""
    global price_cache
    
    try:
        # Update BTC price
        btc_data = crypto_service.get_btc_price()
        price_cache["btc_price"] = btc_data
        
        # Update popular stock prices
        popular_stocks = ["AAPL", "TSLA", "GOOGL", "MSFT", "AMZN"]
        stock_data = stock_service.get_multiple_stock_prices(popular_stocks)
        
        for stock in stock_data:
            price_cache["stock_prices"][stock["symbol"]] = stock
        
        price_cache["last_updated"] = datetime.utcnow()
        print(f"Prices updated at {price_cache['last_updated']}")
        
    except Exception as e:
        print(f"Error updating prices: {str(e)}")

def background_price_updater():
    """Background task that updates prices every 60 seconds."""
    global background_task_running
    
    while background_task_running:
        update_prices()
        time.sleep(60)  # Wait 60 seconds

def start_background_tasks():
    """Start the background price update task."""
    global background_task_running, background_thread
    
    if not background_task_running:
        background_task_running = True
        background_thread = threading.Thread(target=background_price_updater, daemon=True)
        background_thread.start()
        print("Background price update task started")
        
        # Initial price update
        update_prices()

def stop_background_tasks():
    """Stop the background price update task."""
    global background_task_running
    
    background_task_running = False
    if background_thread:
        background_thread.join(timeout=5)
    print("Background price update task stopped")

def get_cached_btc_price():
    """Get cached BTC price."""
    return price_cache.get("btc_price")

def get_cached_stock_price(symbol: str):
    """Get cached stock price for a symbol."""
    return price_cache.get("stock_prices", {}).get(symbol.upper())

def get_cached_stock_prices():
    """Get all cached stock prices."""
    return price_cache.get("stock_prices", {})

def get_last_updated():
    """Get when prices were last updated."""
    return price_cache.get("last_updated") 