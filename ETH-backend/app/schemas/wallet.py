from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WalletBase(BaseModel):
    wallet_name: str

class WalletCreate(WalletBase):
    pass

class WalletResponse(WalletBase):
    id: int
    user_id: int
    wallet_address: str
    balance_btc: float
    balance_usd: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class BalanceResponse(BaseModel):
    user_id: int
    balance_btc: float
    balance_usd: float
    btc_price_usd: float 