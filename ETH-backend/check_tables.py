#!/usr/bin/env python3
"""
Script to check if database tables exist
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

def check_tables():
    """Check if tables exist in the database"""
    try:
        with engine.connect() as connection:
            # Check if users table exists
            result = connection.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'eth_users'
                );
            """))
            users_exists = result.fetchone()[0]
            
            # Check if wallets table exists
            result = connection.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'wallets'
                );
            """))
            wallets_exists = result.fetchone()[0]
            
            # Check columns in users table if it exists
            if users_exists:
                result = connection.execute(text("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'eth_users' 
                    ORDER BY ordinal_position;
                """))
                users_columns = result.fetchall()
                
                print("✅ ETH Users table exists!")
                print("Columns in users table:")
                for col in users_columns:
                    print(f"  - {col[0]} ({col[1]})")
            else:
                print("❌ ETH Users table does not exist!")
            
            # Check columns in wallets table if it exists
            if wallets_exists:
                result = connection.execute(text("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'wallets' 
                    ORDER BY ordinal_position;
                """))
                wallets_columns = result.fetchall()
                
                print("\n✅ Wallets table exists!")
                print("Columns in wallets table:")
                for col in wallets_columns:
                    print(f"  - {col[0]} ({col[1]})")
            else:
                print("\n❌ Wallets table does not exist!")
                
    except Exception as e:
        print(f"❌ Error checking tables: {e}")

if __name__ == "__main__":
    print("🔍 Checking database tables...")
    print("=" * 40)
    check_tables() 