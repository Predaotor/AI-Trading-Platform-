import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { stocksAPI } from "@/utils/api";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  last_updated: string;
}

interface StockPricesResponse {
  stocks: StockData[];
  last_updated: string;
}

const StockPrices = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await stocksAPI.getStockPrices(['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN']);
      
      // Handle the backend response structure
      if (response && response.stocks && Array.isArray(response.stocks)) {
        setStockData(response.stocks);
      } else if (response && Array.isArray(response)) {
        setStockData(response);
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (err) {
      console.error("Error fetching stock prices:", err);
      setError("Failed to fetch stock prices. Please check your connection.");
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockPrices();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchStockPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    return (
      <div className={`flex items-center gap-1 ${
        isPositive ? 'text-green-400' : 
        isNegative ? 'text-red-400' : 'text-gray-400'
      }`}>
        {isPositive && <TrendingUp className="w-4 h-4" />}
        {isNegative && <TrendingDown className="w-4 h-4" />}
        {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {isPositive ? '+' : ''}{formatPrice(change)}
          </span>
          <span className="text-xs">
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  const getStockColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      'AAPL': 'text-blue-400',
      'TSLA': 'text-red-400',
      'GOOGL': 'text-green-400',
      'MSFT': 'text-purple-400',
      'AMZN': 'text-yellow-400',
    };
    return colors[symbol] || 'text-white';
  };

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-purple-500/20 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-purple-500/20 rounded w-1/4"></div>
              <div className="h-4 bg-purple-500/20 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-red-500/20 p-6">
        <div className="text-red-400">
          <p className="font-medium">Connection Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-purple-300 mt-2">
            Make sure the backend server is running on port 8000
          </p>
        </div>
      </Card>
    );
  }

  if (!stockData.length) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="text-gray-400">
          <p>No stock data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Stock Prices</h3>
          <p className="text-purple-300 text-sm">Live Market Data</p>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
          {stockData.length} Stocks
        </Badge>
      </div>
      
      <div className="space-y-3">
        {stockData.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`font-bold ${getStockColor(stock.symbol)}`}>
                {stock.symbol}
              </div>
              <div>
                <p className="text-white font-medium">
                  {formatPrice(stock.price)}
                </p>
                <p className="text-purple-300 text-xs">
                  Vol: {(stock.volume / 1e6).toFixed(1)}M
                </p>
              </div>
            </div>
            
            <div className="text-right">
              {formatChange(stock.change, stock.change_percent)}
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-purple-500/20">
          <p className="text-purple-300 text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StockPrices; 