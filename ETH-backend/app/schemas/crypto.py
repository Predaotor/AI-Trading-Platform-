from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CryptoPriceResponse(BaseModel):
    symbol: str
    price_usd: float
    price_btc: Optional[float] = None
    change_24h: Optional[float] = None
    volume_24h: Optional[float] = None
    market_cap: Optional[float] = None
    last_updated: datetime

class BTCPriceResponse(BaseModel):
    price_usd: float
    price_btc: float = 1.0
    change_24h: Optional[float] = None
    volume_24h: Optional[float] = None
    market_cap: Optional[float] = None
    last_updated: datetime 