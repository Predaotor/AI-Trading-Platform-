from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.dashboard import DashboardStatsResponse, LastUpdateResponse
from app.utils.auth import get_current_active_user
from app.services.background_tasks import get_cached_btc_price, get_cached_stock_prices

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for the current user."""
    try:
        # Get user's wallet balance
        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
        
        if not wallet:
            # Create a default wallet if none exists
            from app.utils.bitcoin import bitcoin_manager
            wallet_info = bitcoin_manager.create_wallet(current_user.id)
            wallet = Wallet(
                user_id=current_user.id,
                wallet_name=wallet_info["wallet_name"],
                wallet_address=wallet_info["wallet_address"],
                private_key_encrypted=wallet_info["private_key_encrypted"],
                balance_btc=wallet_info["balance_btc"],
                balance_usd=wallet_info["balance_usd"]
            )
            db.add(wallet)
            db.commit()
            db.refresh(wallet)
        
        # Get current BTC price for calculations
        btc_price_data = get_cached_btc_price()
        btc_price_usd = btc_price_data["price_usd"] if btc_price_data else 45000.0
        
        # Update wallet balance with current BTC price
        wallet.balance_btc = bitcoin_manager.get_wallet_balance(wallet.wallet_address)
        wallet.balance_usd = wallet.balance_btc * btc_price_usd
        db.commit()
        
        # Calculate 24h P&L (mock calculation for now)
        # In a real app, this would come from trade history
        daily_pnl = wallet.balance_usd * 0.02  # 2% daily return for demo
        
        # Mock active trades count
        active_trades = 3  # This would come from a trades table
        
        # Mock success rate
        success_rate = 87.5  # This would be calculated from trade history
        
        return DashboardStatsResponse(
            total_balance=wallet.balance_usd,
            daily_pnl=daily_pnl,
            active_trades=active_trades,
            success_rate=success_rate
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard stats: {str(e)}"
        )

@router.get("/last-update", response_model=LastUpdateResponse)
def get_last_update():
    """Get the last time prices were updated."""
    try:
        # Get the most recent update time from cached data
        btc_price_data = get_cached_btc_price()
        stock_prices_data = get_cached_stock_prices()
        
        # Use the most recent timestamp
        last_update = datetime.now().isoformat()
        
        if btc_price_data and btc_price_data.get("last_updated"):
            last_update = btc_price_data["last_updated"]
        
        if stock_prices_data:
            for stock in stock_prices_data.values():
                if stock.get("last_updated"):
                    stock_time = datetime.fromisoformat(stock["last_updated"])
                    current_time = datetime.fromisoformat(last_update)
                    if stock_time > current_time:
                        last_update = stock["last_updated"]
        
        return LastUpdateResponse(last_update=last_update)
        
    except Exception as e:
        # Return current time if there's an error
        return LastUpdateResponse(last_update=datetime.now().isoformat())

@router.get("/active-trades")
def get_active_trades(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get count of active trades for the user."""
    # Mock data for now - in a real app, this would query a trades table
    return {"active_trades": 3}

@router.get("/success-rate")
def get_success_rate(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get trading success rate for the user."""
    # Mock data for now - in a real app, this would calculate from trade history
    return {"success_rate": 87.5} 