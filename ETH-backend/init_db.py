#!/usr/bin/env python3
"""
Database initialization script for CryptoBot Pro Backend
This script creates all database tables and initializes the schema.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import text

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Load environment variables
load_dotenv()

from app.database import create_tables, engine
from app.models.user import User
from app.models.wallet import Wallet

def init_database():
    """Initialize the database by creating all tables"""
    try:
        print("Creating database tables...")
        # Explicitly import models to ensure they are registered
        from app.models import User, Wallet
        
        # Create tables in the cryptobot database
        create_tables()
        print("✅ Database tables created successfully!")
        
        # Test the connection to the cryptobot database
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected to database: {version}")
            
            # Verify tables were created
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
            else:
                print("❌ No tables found in database!")
            
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your database credentials in .env file")
        print("3. Ensure the database 'cryptobot' exists")
        print("4. Verify the user has proper permissions")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Initializing CryptoBot Pro Database Tables...")
    print("=" * 50)
    
    # Create all tables
    if init_database():
        print("\n🎉 Database table initialization completed successfully!")
        print("You can now start the application with: python run.py")
    else:
        print("\n❌ Database table initialization failed!")
        sys.exit(1) 