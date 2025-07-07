
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

const ActivityLogs = () => {
  const logs = [
    { type: "success", message: "Arbitrage opportunity detected: ETH/USDC on Uniswap vs Sushi", profit: "+$12.34", time: "2 min ago" },
    { type: "info", message: "Gas price updated: 45 Gwei (within limits)", time: "3 min ago" },
    { type: "success", message: "Trade executed: 0.5 ETH → 1,622.83 USDC", profit: "+$8.90", time: "5 min ago" },
    { type: "warning", message: "High slippage detected on UNI/ETH pair (1.2%)", time: "7 min ago" },
    { type: "success", message: "DCA strategy triggered: Bought 0.1 ETH", profit: "+$3.45", time: "12 min ago" },
    { type: "error", message: "Transaction failed: Insufficient gas limit", time: "15 min ago" },
    { type: "info", message: "Mempool analysis: 2,456 pending transactions", time: "18 min ago" },
    { type: "success", message: "Liquidity mining rewards claimed: 12.34 UNI", profit: "+$45.67", time: "22 min ago" },
    { type: "warning", message: "MEV bot detected, applying protection strategy", time: "25 min ago" },
    { type: "info", message: "Bot started with 4 active strategies", time: "30 min ago" }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Activity Logs</h3>
        <Badge variant="outline" className="ml-auto">Live</Badge>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white leading-relaxed">{log.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-purple-300">{log.time}</span>
                  {log.profit && (
                    <span className={`text-xs font-medium ${
                      log.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {log.profit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ActivityLogs;
