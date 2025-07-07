from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StockPriceResponse(BaseModel):
    symbol: str
    price: float
    change: Optional[float] = None
    change_percent: Optional[float] = None
    volume: Optional[int] = None
    market_cap: Optional[float] = None
    last_updated: datetime

class StockPricesResponse(BaseModel):
    stocks: List[StockPriceResponse]
    last_updated: datetime 