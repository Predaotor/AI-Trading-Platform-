import { Card } from "@/components/ui/card";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { userAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

interface WalletData {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
}

interface WalletResponse {
  id: number;
  user_id: number;
  wallet_name: string;
  wallet_address: string;
  balance_btc: number;
  balance_usd: number;
  created_at: string;
  updated_at?: string;
}

const WalletBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [tokens, setTokens] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get user ID from auth context, fallback to 1 for demo
  const userId = user?.id || 1;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getWallets(userId);
        
        // Handle the backend response structure
        let walletData;
        if (Array.isArray(response)) {
          walletData = response;
        } else if (response.wallets && Array.isArray(response.wallets)) {
          walletData = response.wallets;
        } else if (response.data && Array.isArray(response.data)) {
          walletData = response.data;
        } else {
          throw new Error('Invalid response structure');
        }
        
        // Transform the API response to match our component's expected format
        const transformedData = walletData.map((wallet: WalletResponse) => ({
          symbol: wallet.wallet_name.toUpperCase() || 'BTC',
          name: wallet.wallet_name || 'Bitcoin Wallet',
          balance: wallet.balance_btc.toFixed(8),
          value: `$${wallet.balance_usd.toFixed(2)}`,
          change: '0.0%' // Wallet balance doesn't have change data
        }));
        
        setTokens(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch wallet data:', err);
        setError('Failed to load wallet data');
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Wallet Balance</h3>
          </div>
        </div>
        <div className="text-center text-purple-300">Loading wallet data...</div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Wallet Balance</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBalance(!showBalance)}
          className="text-purple-300 hover:text-purple-200"
        >
          {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {tokens.map((token) => (
          <div key={token.symbol} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{token.symbol.slice(0, 2)}</span>
              </div>
              <div>
                <p className="font-medium text-white">{token.symbol}</p>
                <p className="text-sm text-purple-300">{token.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-white">
                {showBalance ? token.balance : "•••••"}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-purple-300">
                  {showBalance ? token.value : "•••••"}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  token.change.startsWith('+') ? 'text-green-400 bg-green-500/20' : 
                  token.change.startsWith('-') ? 'text-red-400 bg-red-500/20' : 
                  'text-gray-400 bg-gray-500/20'
                }`}>
                  {token.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WalletBalance;
