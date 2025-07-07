#!/usr/bin/env python3
"""
Test script to verify remote database connection
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

def test_remote_connection():
    """Test connection to remote database"""
    try:
        print("🔧 Testing remote database connection...")
        
        # Get DATABASE_URL from environment
        DATABASE_URL = os.getenv("DATABASE_URL")
        if not DATABASE_URL:
            print("❌ DATABASE_URL not found in environment variables")
            return False
        
        print(f"✅ Using DATABASE_URL: {DATABASE_URL[:50]}...")
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected to database: {version}")
            
            # Check if tables exist
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users', 'wallets')
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
        print(f"❌ Error connecting to database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Testing Remote Database Connection...")
    print("=" * 50)
    
    if test_remote_connection():
        print("\n🎉 Remote database connection successful!")
    else:
        print("\n❌ Remote database connection failed!")
        sys.exit(1) 