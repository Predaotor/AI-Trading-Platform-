from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("eth_users.id"), nullable=False)
    wallet_name = Column(String, nullable=False, default="Default Wallet")
    wallet_address = Column(String, nullable=False)
    private_key_encrypted = Column(String, nullable=False)  # Encrypted private key
    balance_btc = Column(Float, default=0.0)
    balance_usd = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="wallets")

    def __repr__(self):
        return f"<Wallet(id={self.id}, user_id={self.user_id}, address='{self.wallet_address}')>" 