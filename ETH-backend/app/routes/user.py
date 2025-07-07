from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.wallet import WalletCreate, WalletResponse, BalanceResponse
from app.utils.auth import get_current_active_user
from app.utils.bitcoin import bitcoin_manager
from app.services.background_tasks import get_cached_btc_price

router = APIRouter()

@router.get("/{user_id}/balance", response_model=BalanceResponse)
def get_user_balance(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's wallet balance."""
    # Ensure user can only access their own balance
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's balance"
        )
    
    # Get user's wallet
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    
    if not wallet:
        # Create a new wallet for the user
        try:
            wallet_info = bitcoin_manager.create_wallet(user_id)
            wallet = Wallet(
                user_id=user_id,
                wallet_name=wallet_info["wallet_name"],
                wallet_address=wallet_info["wallet_address"],
                private_key_encrypted=wallet_info["private_key_encrypted"],
                balance_btc=wallet_info["balance_btc"],
                balance_usd=wallet_info["balance_usd"]
            )
            db.add(wallet)
            db.commit()
            db.refresh(wallet)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create wallet: {str(e)}"
            )
    
    # Get current BTC price
    btc_price_data = get_cached_btc_price()
    btc_price_usd = btc_price_data["price_usd"] if btc_price_data else 45000.0
    
    # Update wallet balance
    wallet.balance_btc = bitcoin_manager.get_wallet_balance(wallet.wallet_address)
    wallet.balance_usd = wallet.balance_btc * btc_price_usd
    db.commit()
    
    return BalanceResponse(
        user_id=user_id,
        balance_btc=wallet.balance_btc,
        balance_usd=wallet.balance_usd,
        btc_price_usd=btc_price_usd
    )

@router.post("/{user_id}/wallet", response_model=WalletResponse)
def create_wallet(
    user_id: int,
    wallet_data: WalletCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new wallet for the user."""
    # Ensure user can only create wallets for themselves
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create wallet for this user"
        )
    
    try:
        wallet_info = bitcoin_manager.create_wallet(user_id, wallet_data.wallet_name)
        
        wallet = Wallet(
            user_id=user_id,
            wallet_name=wallet_info["wallet_name"],
            wallet_address=wallet_info["wallet_address"],
            private_key_encrypted=wallet_info["private_key_encrypted"],
            balance_btc=wallet_info["balance_btc"],
            balance_usd=wallet_info["balance_usd"]
        )
        
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
        
        return wallet
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create wallet: {str(e)}"
        )

@router.get("/{user_id}/wallets", response_model=list[WalletResponse])
def get_user_wallets(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all wallets for a user."""
    # Ensure user can only access their own wallets
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's wallets"
        )
    
    wallets = db.query(Wallet).filter(Wallet.user_id == user_id).all()
    return wallets 