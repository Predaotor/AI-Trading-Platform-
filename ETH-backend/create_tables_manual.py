#!/usr/bin/env python3
"""
Manual table creation script for CryptoBot Pro Backend
This script creates tables using raw SQL to ensure they are created properly.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import text

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Load environment variables
load_dotenv()

from app.database import engine

def create_tables_manual():
    """Create tables manually using SQL"""
    
    # SQL to create eth_users table
    create_users_table = """
    CREATE TABLE IF NOT EXISTS eth_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR UNIQUE NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        hashed_password VARCHAR NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    # SQL to create wallets table
    create_wallets_table = """
    CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES eth_users(id),
        wallet_name VARCHAR NOT NULL DEFAULT 'Default Wallet',
        wallet_address VARCHAR NOT NULL,
        private_key_encrypted VARCHAR NOT NULL,
        balance_btc FLOAT DEFAULT 0.0,
        balance_usd FLOAT DEFAULT 0.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    try:
        print("Creating tables manually...")
        
        with engine.connect() as connection:
            # Create users table
            print("Creating users table...")
            connection.execute(text(create_users_table))
            
            # Create wallets table
            print("Creating wallets table...")
            connection.execute(text(create_wallets_table))
            
            # Commit the changes
            connection.commit()
            
            print("✅ Tables created successfully!")
            
            # Verify tables exist
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('eth_users', 'wallets')
                ORDER BY table_name;
            """))
            
            tables = result.fetchall()
            if tables:
                print("✅ Tables found in database:")
                for table in tables:
                    print(f"  - {table[0]}")
                    
                    # Show columns for each table
                    col_result = connection.execute(text(f"""
                        SELECT column_name, data_type 
                        FROM information_schema.columns 
                        WHERE table_name = '{table[0]}' 
                        ORDER BY ordinal_position;
                    """))
                    
                    columns = col_result.fetchall()
                    for col in columns:
                        print(f"    - {col[0]} ({col[1]})")
            else:
                print("❌ No tables found!")
                
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 Creating tables manually...")
    print("=" * 50)
    
    if create_tables_manual():
        print("\n🎉 Manual table creation completed successfully!")
    else:
        print("\n❌ Manual table creation failed!")
        sys.exit(1) 