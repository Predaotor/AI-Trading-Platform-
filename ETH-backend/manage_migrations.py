#!/usr/bin/env python3
"""
Database Migration Management Script for CryptoBot Pro Backend
Provides easy commands for managing database migrations with Alembic.
"""

import os
import sys
import subprocess
import argparse
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Load environment variables
load_dotenv()

def run_command(command, description):
    """Run a command and handle the result"""
    print(f"🔧 {description}...")
    result = subprocess.run(command, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ {description} completed successfully!")
        if result.stdout:
            print(result.stdout)
        return True
    else:
        print(f"❌ {description} failed!")
        if result.stderr:
            print(result.stderr)
        return False

def init_migrations():
    """Initialize Alembic migrations"""
    print("🚀 Initializing Alembic migrations...")
    
    # Import models to ensure they are registered
    from app.models import User, Wallet
    
    # Create initial migration
    if run_command(["alembic", "revision", "--autogenerate", "-m", "Initial migration"], 
                   "Creating initial migration"):
        # Apply the migration
        return run_command(["alembic", "upgrade", "head"], "Applying initial migration")
    return False

def create_migration(message):
    """Create a new migration"""
    return run_command(["alembic", "revision", "--autogenerate", "-m", message], 
                      f"Creating migration: {message}")

def apply_migrations():
    """Apply all pending migrations"""
    return run_command(["alembic", "upgrade", "head"], "Applying all migrations")

def show_migrations():
    """Show migration history"""
    return run_command(["alembic", "history"], "Showing migration history")

def show_current():
    """Show current migration"""
    return run_command(["alembic", "current"], "Showing current migration")

def downgrade_migration(revision):
    """Downgrade to a specific revision"""
    return run_command(["alembic", "downgrade", revision], f"Downgrading to revision: {revision}")

def reset_database():
    """Reset database by downgrading to base and upgrading to head"""
    print("⚠️  WARNING: This will reset the database!")
    confirm = input("Are you sure you want to continue? (yes/no): ")
    
    if confirm.lower() != 'yes':
        print("❌ Database reset cancelled.")
        return False
    
    if run_command(["alembic", "downgrade", "base"], "Downgrading to base"):
        return run_command(["alembic", "upgrade", "head"], "Upgrading to head")
    return False

def main():
    parser = argparse.ArgumentParser(description="Database Migration Management")
    parser.add_argument("command", choices=[
        "init", "create", "apply", "history", "current", "downgrade", "reset"
    ], help="Migration command to execute")
    parser.add_argument("--message", "-m", help="Migration message (for create command)")
    parser.add_argument("--revision", "-r", help="Revision to downgrade to (for downgrade command)")
    
    args = parser.parse_args()
    
    print("🚀 CryptoBot Pro Database Migration Manager")
    print("=" * 50)
    
    if args.command == "init":
        success = init_migrations()
    elif args.command == "create":
        if not args.message:
            print("❌ Error: --message is required for create command")
            sys.exit(1)
        success = create_migration(args.message)
    elif args.command == "apply":
        success = apply_migrations()
    elif args.command == "history":
        success = show_migrations()
    elif args.command == "current":
        success = show_current()
    elif args.command == "downgrade":
        if not args.revision:
            print("❌ Error: --revision is required for downgrade command")
            sys.exit(1)
        success = downgrade_migration(args.revision)
    elif args.command == "reset":
        success = reset_database()
    else:
        print("❌ Unknown command")
        sys.exit(1)
    
    if success:
        print("\n🎉 Migration operation completed successfully!")
    else:
        print("\n❌ Migration operation failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 