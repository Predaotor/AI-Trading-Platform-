
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bot, Play, Pause, Square, Settings, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BotControlsProps {
  botStatus: "stopped" | "running" | "paused";
  setBotStatus: (status: "stopped" | "running" | "paused") => void;
}

const BotControls = ({ botStatus, setBotStatus }: BotControlsProps) => {
  const strategies = [
    { name: "Arbitrage Scanner", active: true, profit: "+$45.23", trades: 12 },
    { name: "DCA Strategy", active: false, profit: "+$123.45", trades: 8 },
    { name: "Liquidity Mining", active: true, profit: "+$67.89", trades: 5 },
    { name: "MEV Protection", active: true, profit: "-$2.34", trades: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Bot Controls</h3>
          </div>
          <Badge variant={botStatus === "running" ? "default" : "secondary"}>
            {botStatus.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={() => setBotStatus("running")}
            disabled={botStatus === "running"}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Bot
          </Button>
          <Button
            onClick={() => setBotStatus("paused")}
            disabled={botStatus !== "running"}
            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause Bot
          </Button>
          <Button
            onClick={() => setBotStatus("stopped")}
            disabled={botStatus === "stopped"}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Bot
          </Button>
        </div>

        {/* Risk Settings */}
        <div className="bg-purple-500/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-medium text-white">Risk Management</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-300">Max Loss per Trade:</span>
              <span className="text-white ml-2">2.5%</span>
            </div>
            <div>
              <span className="text-purple-300">Daily Loss Limit:</span>
              <span className="text-white ml-2">$500</span>
            </div>
            <div>
              <span className="text-purple-300">Gas Price Limit:</span>
              <span className="text-white ml-2">50 Gwei</span>
            </div>
            <div>
              <span className="text-purple-300">Slippage Tolerance:</span>
              <span className="text-white ml-2">0.5%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Strategies */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Active Strategies</h3>
          <Button variant="outline" size="sm" className="border-purple-500/30">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>

        <div className="space-y-4">
          {strategies.map((strategy, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-purple-500/10">
              <div className="flex items-center space-x-3">
                <Switch checked={strategy.active} />
                <div>
                  <p className="font-medium text-white">{strategy.name}</p>
                  <p className="text-sm text-purple-300">{strategy.trades} trades today</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  strategy.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {strategy.profit}
                </p>
                <p className="text-sm text-purple-300">24h P&L</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BotControls;
