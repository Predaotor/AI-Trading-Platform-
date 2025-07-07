from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.database import engine, Base
from app.routes import auth, user, crypto, stocks, dashboard
from app.services.background_tasks import start_background_tasks, stop_background_tasks

# Import models to ensure they are registered with SQLAlchemy
from app.models import User, Wallet

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_background_tasks()
    yield
    # Shutdown
    stop_background_tasks()

app = FastAPI(
    title="CryptoBot Pro API",
    description="Backend API for CryptoBot Pro trading platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(crypto.router, prefix="/crypto", tags=["Cryptocurrency"])
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "CryptoBot Pro API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 