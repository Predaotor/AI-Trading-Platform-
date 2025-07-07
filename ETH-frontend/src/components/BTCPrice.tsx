import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cryptoAPI } from "@/utils/api";

interface BTCPriceData {
  price_usd: number;
  price_btc: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  last_updated: string;
}

const BTCPrice = () => {
  const [btcData, setBtcData] = useState<BTCPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBTCPrice = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cryptoAPI.getBTCPrice();
      
      // Handle the backend response structure
      if (response && response.price_usd) {
        setBtcData(response);
      } else if (response && response.data && response.data.price_usd) {
        setBtcData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (err) {
      console.error("Error fetching BTC price:", err);
      setError("Failed to fetch BTC price. Please check your connection.");
      setBtcData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBTCPrice();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBTCPrice, 30000);
    
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

  const formatChange = (change: number) => {
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
        <span className="font-medium">
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-purple-500/20 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-purple-500/20 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-purple-500/20 rounded w-1/4"></div>
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

  if (!btcData) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="text-gray-400">
          <p>No BTC price data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Bitcoin Price</h3>
          <p className="text-purple-300 text-sm">Live BTC/USD</p>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
          BTC
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-white">
            {formatPrice(btcData.price_usd)}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-sm">24h Change</p>
            {formatChange(btcData.change_24h)}
          </div>
          
          <div className="text-right">
            <p className="text-purple-300 text-sm">Volume (24h)</p>
            <p className="text-white font-medium">
              ${(btcData.volume_24h / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-purple-500/20">
          <p className="text-purple-300 text-xs">
            Last updated: {new Date(btcData.last_updated).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BTCPrice; 