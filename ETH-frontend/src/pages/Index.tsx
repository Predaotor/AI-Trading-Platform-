import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wallet, Bot, TrendingUp, Settings, Activity, DollarSign, User, Clock, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletBalance from "@/components/WalletBalance";
import BTCPrice from "@/components/BTCPrice";
import StockPrices from "@/components/StockPrices";
import BotControls from "@/components/BotControls";
import TradingInterface from "@/components/TradingInterface";
import ActivityLogs from "@/components/ActivityLogs";
import PerformanceChart from "@/components/PerformanceChart";
import BotSettings from "@/components/BotSettings";
import ErrorBoundary from "@/components/ErrorBoundary";
import { dashboardAPI } from "@/utils/api";

interface DashboardStats {
  totalBalance: number;
  dailyPnL: number;
  activeTrades: number;
  successRate: number;
}

interface LastUpdate {
  lastUpdate: string;
}

const Index = () => {
  const [botStatus, setBotStatus] = useState<"stopped" | "running" | "paused">("stopped");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getStats();
      setStats({
        totalBalance: statsResponse.total_balance || 0,
        dailyPnL: statsResponse.daily_pnl || 0,
        activeTrades: statsResponse.active_trades || 0,
        successRate: statsResponse.success_rate || 0
      });

      // Fetch last update time
      const updateResponse = await dashboardAPI.getLastUpdate();
      setLastUpdate(updateResponse.last_update || "");
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatLastUpdate = (timestamp: string) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CryptoBot Pro</h1>
                  <p className="text-purple-300 text-sm">Automated Web3 Trading Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  botStatus === "running" ? "bg-green-500/20 text-green-400" :
                  botStatus === "paused" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {botStatus === "running" ? "● Active" : botStatus === "paused" ? "● Paused" : "● Inactive"}
                </div>
                <Link to="/profile" className="text-purple-400 hover:text-purple-300 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/" className="text-purple-400 hover:text-purple-300">
                  Logout
                </Link>
                <Button variant="outline" className="border-purple-500/30 hover:border-purple-400">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="container mx-auto px-6 py-8">
          {/* Last Update Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-purple-300 text-sm">
              <Clock className="w-4 h-4" />
              <span>Prices updated: {formatLastUpdate(lastUpdate)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              <p className="font-medium">Dashboard Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Stats */}
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "Loading..." : stats ? formatCurrency(stats.totalBalance) : "N/A"}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">24h P&L</p>
                  <p className={`text-2xl font-bold ${stats && stats.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {loading ? "Loading..." : stats ? `${stats.dailyPnL >= 0 ? '+' : ''}${formatCurrency(stats.dailyPnL)}` : "N/A"}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${stats && stats.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Active Trades</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "Loading..." : stats ? stats.activeTrades : "N/A"}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-cyan-400" />
              </div>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "Loading..." : stats ? `${stats.successRate.toFixed(1)}%` : "N/A"}
                  </p>
                </div>
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="bg-black/20 backdrop-blur-xl border-purple-500/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500/20">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-purple-500/20">
                Trading
              </TabsTrigger>
              <TabsTrigger value="bot-controls" className="data-[state=active]:bg-purple-500/20">
                Bot Controls
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BTCPrice />
                <WalletBalance />
                <StockPrices />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart />
                <ActivityLogs />
              </div>
            </TabsContent>

            <TabsContent value="trading">
              <TradingInterface />
            </TabsContent>

            <TabsContent value="bot-controls">
              <BotControls botStatus={botStatus} setBotStatus={setBotStatus} />
            </TabsContent>

            <TabsContent value="settings">
              <BotSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
