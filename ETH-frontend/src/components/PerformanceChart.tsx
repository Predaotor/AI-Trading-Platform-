
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

const PerformanceChart = () => {
  const data = [
    { time: "00:00", portfolio: 10000, profit: 0 },
    { time: "04:00", portfolio: 10234, profit: 234 },
    { time: "08:00", portfolio: 10456, profit: 456 },
    { time: "12:00", portfolio: 10345, profit: 345 },
    { time: "16:00", portfolio: 10678, profit: 678 },
    { time: "20:00", portfolio: 10891, profit: 891 },
    { time: "24:00", portfolio: 11123, profit: 1123 }
  ];

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Performance (24h)</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400">+11.23%</p>
          <p className="text-sm text-purple-300">+$1,123.45</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Area
              type="monotone"
              dataKey="portfolio"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-purple-500/20">
        <div className="text-center">
          <p className="text-sm text-purple-300">Total Trades</p>
          <p className="text-lg font-semibold text-white">42</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-purple-300">Win Rate</p>
          <p className="text-lg font-semibold text-green-400">84.3%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-purple-300">Avg Profit</p>
          <p className="text-lg font-semibold text-white">$26.75</p>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;
