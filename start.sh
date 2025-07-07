#!/bin/bash

echo "🚀 Starting CryptoBot Pro Full Stack Application"
echo "================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start Backend
echo ""
echo "🔧 Starting Backend (FastAPI)..."
cd ETH-backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before running in production"
fi

# Start backend in background
echo "🚀 Starting FastAPI server on http://localhost:8000"
python run.py &
BACKEND_PID=$!

cd ..

# Start Frontend
echo ""
echo "🎨 Starting Frontend (React)..."
cd ETH-frontend

# Install dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Start frontend
echo "🚀 Starting React development server on http://localhost:8080"
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 CryptoBot Pro is starting up!"
echo "================================="
echo "📊 Backend API: http://localhost:8000"
echo "🎨 Frontend App: http://localhost:8080"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 