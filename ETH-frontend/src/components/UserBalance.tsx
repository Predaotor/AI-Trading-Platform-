import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, RefreshCw, Plus } from "lucide-react";
import { userAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

interface BalanceData {
  user_id: number;
  balance_btc: number;
  balance_usd: number;
  btc_price_usd: number;
}

const UserBalance = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // Get user ID from auth context, fallback to 1 for demo
  const userId = user?.id || 1;

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getBalance(userId);
      
      // Handle the backend response structure
      if (response.user_id && response.balance_btc !== undefined) {
        setBalanceData(response);
      } else if (response.data && response.data.user_id) {
        setBalanceData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
      
      setError(null);
    } catch (err) {
      setError("Failed to fetch balance");
      console.error("Error fetching balance:", err);
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    try {
      setRefreshing(true);
      await fetchBalance();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatBTC = (amount: number) => {
    return `${amount.toFixed(8)} BTC`;
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
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchBalance}
            className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!balanceData) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="text-gray-400">
          <p>No balance data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
            <p className="text-purple-300 text-sm">Your Bitcoin Wallet</p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
          User #{balanceData.user_id}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-purple-300 text-sm mb-1">Total Balance (USD)</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(balanceData.balance_usd)}
          </p>
        </div>
        
        <div>
          <p className="text-purple-300 text-sm mb-1">Bitcoin Balance</p>
          <p className="text-xl font-semibold text-cyan-400">
            {formatBTC(balanceData.balance_btc)}
          </p>
        </div>
        
        <div className="pt-3 border-t border-purple-500/20">
          <p className="text-purple-300 text-sm mb-2">Current BTC Price</p>
          <p className="text-lg font-medium text-green-400">
            {formatCurrency(balanceData.btc_price_usd)}
          </p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshBalance}
            disabled={refreshing}
            className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserBalance; 