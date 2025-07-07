from fastapi import APIRouter
from app.schemas.crypto import BTCPriceResponse, CryptoPriceResponse
from app.services.background_tasks import get_cached_btc_price
from app.services.crypto_service import crypto_service

router = APIRouter()

@router.get("/btc-price", response_model=BTCPriceResponse)
def get_btc_price():
    """Get current BTC price."""
    # Try to get from cache first
    cached_price = get_cached_btc_price()
    
    if cached_price:
        return BTCPriceResponse(**cached_price)
    
    # If not in cache, fetch fresh data
    btc_data = crypto_service.get_btc_price()
    return BTCPriceResponse(**btc_data)

@router.get("/price/{symbol}", response_model=CryptoPriceResponse)
def get_crypto_price(symbol: str):
    """Get price for a specific cryptocurrency."""
    crypto_data = crypto_service.get_crypto_price(symbol)
    
    if not crypto_data:
        return CryptoPriceResponse(
            symbol=symbol.upper(),
            price_usd=0.0,
            price_btc=0.0,
            change_24h=0.0,
            volume_24h=0.0,
            market_cap=0.0,
            last_updated=None
        )
    
    return CryptoPriceResponse(**crypto_data) 