import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUp, Zap, TrendingUp, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { cryptoAPI, tradingAPI, userAPI } from "@/utils/api";

interface CryptoPair {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

interface Trade {
  id: number;
  type: string;
  pair: string;
  amount: string;
  price: string;
  time: string;
  profit: string;
  status: string;
}

interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  slippage: number;
  gasEstimate: number;
  gasPrice: number;
}

interface UserBalance {
  user_id: number;
  balance_btc: number;
  balance_usd: number;
  btc_price_usd: number;
}

const TradingInterface = () => {
  const { user } = useAuth();
  const userId = user?.id || 1;

  // State for form inputs
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // State for data
  const [cryptoPairs, setCryptoPairs] = useState<CryptoPair[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);

  // State for UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [cryptoPairsError, setCryptoPairsError] = useState<string | null>(null);
  const [tradesError, setTradesError] = useState<string | null>(null);

  // Available tokens (basic set - in a real app, this would come from an API)
  const availableTokens = [
    { symbol: "ETH", name: "Ethereum", balance: userBalance?.balance_btc || 0 },
    { symbol: "USDC", name: "USD Coin", balance: (userBalance?.balance_usd || 0) / 1000 },
    { symbol: "UNI", name: "Uniswap", balance: 0 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", balance: 0 },
    { symbol: "LINK", name: "Chainlink", balance: 0 },
    { symbol: "AAVE", name: "Aave", balance: 0 }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCryptoPairsError(null);
      setTradesError(null);

      // Fetch user balance (this endpoint exists)
      try {
        const balanceData = await userAPI.getBalance(userId);
        setUserBalance(balanceData);
      } catch (err) {
        console.error('Failed to fetch user balance:', err);
        setError('Failed to load user balance. Please check your connection.');
      }

      // Fetch crypto pairs (this endpoint may not exist yet)
      try {
        const pairsData = await cryptoAPI.getCryptoPairs();
        setCryptoPairs(pairsData);
      } catch (err) {
        console.error('Failed to fetch crypto pairs:', err);
        setCryptoPairsError('Crypto pairs data not available. Backend endpoint may not be implemented yet.');
        setCryptoPairs([]);
      }

      // Fetch recent trades (this endpoint may not exist yet)
      try {
        const tradesData = await tradingAPI.getRecentTrades(userId);
        setRecentTrades(tradesData);
      } catch (err) {
        console.error('Failed to fetch recent trades:', err);
        setTradesError('Recent trades not available. Backend endpoint may not be implemented yet.');
        setRecentTrades([]);
      }

    } catch (err) {
      console.error('Failed to fetch trading data:', err);
      setError('Failed to load trading data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getSwapQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setSwapQuote(null);
      return;
    }

    try {
      const quote = await tradingAPI.getSwapQuote(fromToken, toToken, parseFloat(fromAmount));
      setSwapQuote(quote);
      setToAmount(quote.toAmount.toFixed(6));
    } catch (err) {
      console.error('Failed to get swap quote:', err);
      setSwapQuote(null);
      setToAmount("");
    }
  };

  const executeSwap = async () => {
    if (!swapQuote || !fromAmount) return;

    try {
      setSwapLoading(true);
      await tradingAPI.executeSwap({
        fromToken,
        toToken,
        amount: parseFloat(fromAmount),
        slippage: swapQuote.slippage
      });
      
      // Reset form and refresh data
      setFromAmount("");
      setToAmount("");
      setSwapQuote(null);
      await fetchData();
      
      // Show success message (in a real app, you'd use a toast notification)
      alert('Swap executed successfully!');
    } catch (err) {
      console.error('Failed to execute swap:', err);
      alert('Failed to execute swap. Please try again.');
    } finally {
      setSwapLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    getSwapQuote();
  }, [fromToken, toToken, fromAmount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getTokenBalance = (symbol: string) => {
    const token = availableTokens.find(t => t.symbol === symbol);
    return token?.balance || 0;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-purple-500/20 rounded w-1/3"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-purple-500/20 rounded"></div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-purple-500/20 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-purple-500/20 rounded"></div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Form */}
      <div className="lg:col-span-1">
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Swap Tokens</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={refreshing}
              className="text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <label className="text-sm text-purple-300">From</label>
              <div className="flex space-x-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-32 bg-purple-500/10 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-purple-500/10 border-purple-500/30"
                  type="number"
                  step="0.000001"
                />
              </div>
              <p className="text-xs text-purple-300">
                Balance: {getTokenBalance(fromToken).toFixed(6)} {fromToken}
              </p>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full"
                onClick={() => {
                  setFromToken(toToken);
                  setToToken(fromToken);
                  setFromAmount(toAmount);
                  setToAmount(fromAmount);
                }}
              >
                <ArrowDownUp className="w-4 h-4 text-purple-400" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <label className="text-sm text-purple-300">To</label>
              <div className="flex space-x-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-32 bg-purple-500/10 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.0"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="bg-purple-500/10 border-purple-500/30"
                  type="number"
                  step="0.000001"
                  readOnly
                />
              </div>
              <p className="text-xs text-purple-300">
                Balance: {getTokenBalance(toToken).toFixed(6)} {toToken}
              </p>
            </div>

            {/* Trade Info */}
            {swapQuote && (
              <div className="bg-purple-500/10 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">Rate:</span>
                  <span className="text-white">1 {fromToken} = {swapQuote.rate.toFixed(6)} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Slippage:</span>
                  <span className="text-white">{swapQuote.slippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Gas Fee:</span>
                  <span className="text-white">~{swapQuote.gasPrice} Gwei (${((swapQuote.gasEstimate * swapQuote.gasPrice * 1e-9) * (userBalance?.btc_price_usd || 45000)).toFixed(2)})</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              disabled={!swapQuote || swapLoading || !fromAmount}
              onClick={executeSwap}
            >
              <Zap className="w-4 h-4 mr-2" />
              {swapLoading ? 'Executing...' : 'Execute Swap'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Trading Data */}
      <div className="lg:col-span-2 space-y-6">
        {/* Top Trading Pairs */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Trading Pairs</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          
          {cryptoPairsError ? (
            <div className="text-center py-8">
              <div className="text-yellow-400 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">{cryptoPairsError}</p>
              </div>
              <p className="text-xs text-purple-300">
                This feature requires backend implementation of the crypto pairs endpoint.
              </p>
            </div>
          ) : cryptoPairs.length > 0 ? (
            <div className="space-y-3">
              {cryptoPairs.map((pair, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-white">{pair.symbol}</p>
                    <p className="text-sm text-purple-300">Vol: {formatVolume(pair.volume)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      {pair.symbol.includes('USDC') ? formatCurrency(pair.price) : pair.price.toFixed(6)}
                    </p>
                    <span className={`text-sm ${
                      pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No trading pairs available</p>
            </div>
          )}
        </Card>

        {/* Recent Trades */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Bot Trades</h3>
          
          {tradesError ? (
            <div className="text-center py-8">
              <div className="text-yellow-400 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">{tradesError}</p>
              </div>
              <p className="text-xs text-purple-300">
                This feature requires backend implementation of the recent trades endpoint.
              </p>
            </div>
          ) : recentTrades.length > 0 ? (
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div key={trade.id || index} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.type === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {trade.type}
                    </span>
                    <div>
                      <p className="font-medium text-white">{trade.pair}</p>
                      <p className="text-sm text-purple-300">{trade.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{trade.price}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-purple-300">{trade.time}</span>
                      <span className={`text-sm ${
                        trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.profit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No recent trades available</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TradingInterface;
