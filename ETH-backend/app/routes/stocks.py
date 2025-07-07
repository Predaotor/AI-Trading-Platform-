from fastapi import APIRouter, Query
from typing import List
from app.schemas.stocks import StockPriceResponse, StockPricesResponse
from app.services.background_tasks import get_cached_stock_price, get_cached_stock_prices
from app.services.stock_service import stock_service

router = APIRouter()

@router.get("/prices", response_model=StockPricesResponse)
def get_stock_prices(tickers: str = Query(..., description="Comma-separated list of stock tickers")):
    """Get stock prices for specified tickers."""
    # Parse tickers from query parameter
    ticker_list = [ticker.strip().upper() for ticker in tickers.split(",")]
    
    # Try to get from cache first
    cached_prices = get_cached_stock_prices()
    results = []
    
    for ticker in ticker_list:
        cached_price = cached_prices.get(ticker)
        if cached_price:
            results.append(StockPriceResponse(**cached_price))
        else:
            # Fetch fresh data if not in cache
            stock_data = stock_service.get_stock_price(ticker)
            if stock_data:
                results.append(StockPriceResponse(**stock_data))
    
    return StockPricesResponse(
        stocks=results,
        last_updated=None  # Will be set by the service
    )

@router.get("/price/{symbol}", response_model=StockPriceResponse)
def get_stock_price(symbol: str):
    """Get price for a specific stock symbol."""
    # Try cache first
    cached_price = get_cached_stock_price(symbol.upper())
    
    if cached_price:
        return StockPriceResponse(**cached_price)
    
    # Fetch fresh data
    stock_data = stock_service.get_stock_price(symbol)
    
    if not stock_data:
        return StockPriceResponse(
            symbol=symbol.upper(),
            price=0.0,
            change=0.0,
            change_percent=0.0,
            volume=0,
            market_cap=0.0,
            last_updated=None
        )
    
    return StockPriceResponse(**stock_data)

@router.get("/popular", response_model=StockPricesResponse)
def get_popular_stocks():
    """Get prices for popular stocks."""
    popular_stocks = stock_service.get_popular_stocks()
    stock_responses = [StockPriceResponse(**stock) for stock in popular_stocks]
    
    return StockPricesResponse(
        stocks=stock_responses,
        last_updated=None
    ) 