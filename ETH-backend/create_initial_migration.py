#!/usr/bin/env python3
"""
Script to create initial Alembic migration
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Load environment variables
load_dotenv()

def create_initial_migration():
    """Create initial migration for all models"""
    try:
        print("🔧 Creating initial Alembic migration...")
        
        # Import models to ensure they are registered
        from app.models import User, Wallet
        
        # Generate initial migration
        result = subprocess.run([
            "alembic", "revision", "--autogenerate", "-m", "Initial migration"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Initial migration created successfully!")
            print(result.stdout)
            
            # Run the migration
            print("\n🚀 Running migration...")
            result = subprocess.run([
                "alembic", "upgrade", "head"
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Migration applied successfully!")
                print(result.stdout)
            else:
                print("❌ Error applying migration:")
                print(result.stderr)
                return False
                
        else:
            print("❌ Error creating migration:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Setting up Alembic migrations...")
    print("=" * 50)
    
    if create_initial_migration():
        print("\n🎉 Alembic setup completed successfully!")
        print("You can now use 'alembic revision --autogenerate -m \"message\"' to create new migrations")
        print("and 'alembic upgrade head' to apply migrations.")
    else:
        print("\n❌ Alembic setup failed!")
        sys.exit(1) 