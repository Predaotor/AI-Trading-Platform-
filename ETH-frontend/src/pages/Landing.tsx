import { Link } from 'react-router-dom';
import { Bot, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
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
              <Link to="/signin">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Automated Crypto Trading
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {' '}Made Simple
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered trading bot that analyzes market trends, executes trades automatically, 
            and maximizes your crypto portfolio returns with intelligent risk management.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-lg">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
            <p className="text-purple-200">
              Advanced market analysis using AI algorithms to identify profitable trading opportunities.
            </p>
          </div>

          <div className="text-center p-6 bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-lg">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auto Trading</h3>
            <p className="text-purple-200">
              Execute trades automatically based on your strategy with 24/7 market monitoring.
            </p>
          </div>

          <div className="text-center p-6 bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-lg">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Risk Management</h3>
            <p className="text-purple-200">
              Built-in risk controls and stop-loss mechanisms to protect your investments.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-purple-200 mb-8">
            Join thousands of traders who trust CryptoBot Pro for their automated trading needs.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing; 