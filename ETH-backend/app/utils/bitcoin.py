import bitcoinlib
from bitcoinlib.wallets import Wallet, wallet_exists
from bitcoinlib.mnemonic import Mnemonic
from bitcoinlib.keys import HDKey
import os
from cryptography.fernet import Fernet
from base64 import b64encode, b64decode

class BitcoinWalletManager:
    def __init__(self):
        self.encryption_key = os.getenv("WALLET_ENCRYPTION_KEY", "your-encryption-key-change-in-production")
        self.cipher = Fernet(self.encryption_key.encode())
    
    def create_wallet(self, user_id: int, wallet_name: str = "Default Wallet") -> dict:
        """Create a new Bitcoin wallet for a user."""
        try:
            # Generate a unique wallet name
            wallet_id = f"user_{user_id}_{wallet_name}"
            
            # Create wallet if it doesn't exist
            if not wallet_exists(wallet_id):
                # Generate mnemonic
                mnemonic = Mnemonic().generate()
                
                # Create wallet
                wallet = Wallet.create(
                    name=wallet_id,
                    keys=mnemonic,
                    network='bitcoin',
                    witness_type='segwit'
                )
            else:
                wallet = Wallet(wallet_id)
            
            # Get wallet info
            wallet_info = {
                "wallet_name": wallet_name,
                "wallet_address": wallet.get_key().address,
                "private_key_encrypted": self._encrypt_private_key(wallet.get_key().wif),
                "balance_btc": 0.0,
                "balance_usd": 0.0
            }
            
            return wallet_info
            
        except Exception as e:
            raise Exception(f"Failed to create wallet: {str(e)}")
    
    def get_wallet_balance(self, wallet_address: str) -> float:
        """Get the balance of a Bitcoin wallet address."""
        try:
            # Use bitcoinlib to get balance
            wallet = Wallet(wallet_address)
            balance = wallet.balance()
            return balance / 100000000  # Convert satoshis to BTC
        except Exception as e:
            print(f"Error getting wallet balance: {str(e)}")
            return 0.0
    
    def _encrypt_private_key(self, private_key: str) -> str:
        """Encrypt a private key for storage."""
        encrypted = self.cipher.encrypt(private_key.encode())
        return b64encode(encrypted).decode()
    
    def _decrypt_private_key(self, encrypted_key: str) -> str:
        """Decrypt a stored private key."""
        encrypted_bytes = b64decode(encrypted_key.encode())
        decrypted = self.cipher.decrypt(encrypted_bytes)
        return decrypted.decode()
    
    def get_current_btc_price(self) -> float:
        """Get current BTC price in USD."""
        try:
            # This is a simplified version - in production, use a real API
            # For now, return a mock price
            return 45000.0  # Mock BTC price
        except Exception as e:
            print(f"Error getting BTC price: {str(e)}")
            return 45000.0  # Fallback price

# Global instance
bitcoin_manager = BitcoinWalletManager() 