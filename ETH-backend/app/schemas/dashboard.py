from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DashboardStatsResponse(BaseModel):
    total_balance: float
    daily_pnl: float
    active_trades: int
    success_rate: float

class LastUpdateResponse(BaseModel):
    last_update: str 