
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, Shield, Zap, AlertTriangle, Save } from "lucide-react";
import { useState } from "react";

const BotSettings = () => {
  const [maxLossPerTrade, setMaxLossPerTrade] = useState([2.5]);
  const [dailyLossLimit, setDailyLossLimit] = useState([500]);
  const [gasPriceLimit, setGasPriceLimit] = useState([50]);
  const [slippageTolerance, setSlippageTolerance] = useState([0.5]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trading Settings */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Trading Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-purple-300">Trading Mode</Label>
            <Select defaultValue="aggressive">
              <SelectTrigger className="bg-purple-500/10 border-purple-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Max Loss per Trade: {maxLossPerTrade[0]}%</Label>
            <Slider
              value={maxLossPerTrade}
              onValueChange={setMaxLossPerTrade}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Daily Loss Limit: ${dailyLossLimit[0]}</Label>
            <Slider
              value={dailyLossLimit}
              onValueChange={setDailyLossLimit}
              max={2000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Slippage Tolerance: {slippageTolerance[0]}%</Label>
            <Slider
              value={slippageTolerance}
              onValueChange={setSlippageTolerance}
              max={5}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Auto-compound Profits</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Emergency Stop</Label>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Security Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-purple-300">Wallet Address</Label>
            <Input
              placeholder="0x742d35Cc6634C0532925a3b8D6Ac6E6e43Cc7b15"
              className="bg-purple-500/10 border-purple-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Gas Price Limit: {gasPriceLimit[0]} Gwei</Label>
            <Slider
              value={gasPriceLimit}
              onValueChange={setGasPriceLimit}
              max={200}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">RPC Endpoint</Label>
            <Select defaultValue="infura">
              <SelectTrigger className="bg-purple-500/10 border-purple-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infura">Infura</SelectItem>
                <SelectItem value="alchemy">Alchemy</SelectItem>
                <SelectItem value="local">Local Node</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">MEV Protection</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Transaction Simulation</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Flash Loan Detection</Label>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Advanced Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-purple-300">API Rate Limit (req/min)</Label>
            <Input
              placeholder="100"
              type="number"
              className="bg-purple-500/10 border-purple-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Webhook URL</Label>
            <Input
              placeholder="https://your-webhook.com/notify"
              className="bg-purple-500/10 border-purple-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Log Level</Label>
            <Select defaultValue="info">
              <SelectTrigger className="bg-purple-500/10 border-purple-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Enable Notifications</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Auto-restart on Error</Label>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Alert Settings */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Alert Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Large Profit Alerts</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">Loss Alerts</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">High Gas Alerts</Label>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-purple-300">MEV Alerts</Label>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Alert Threshold ($)</Label>
            <Input
              placeholder="100"
              type="number"
              className="bg-purple-500/10 border-purple-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Email Notifications</Label>
            <Input
              placeholder="your@email.com"
              type="email"
              className="bg-purple-500/10 border-purple-500/30"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="lg:col-span-2">
        <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default BotSettings;
