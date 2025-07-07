import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Shield, CreditCard, LogOut, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">User Profile</h1>
                <p className="text-purple-300 text-sm">Account Settings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 p-6 rounded-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">John Doe</h2>
                <p className="text-purple-300">john.doe@example.com</p>
                <div className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 inline-block">
                  ● Verified Account
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-purple-500/20">
                  <span className="text-purple-300">Member Since</span>
                  <span className="text-white">January 2024</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-purple-500/20">
                  <span className="text-purple-300">Account Type</span>
                  <span className="text-white">Premium</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-purple-500/20">
                  <span className="text-purple-300">Last Login</span>
                  <span className="text-white">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings */}
            <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value="john.doe@example.com"
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value="John Doe"
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Security
              </h3>
              <div className="space-y-4">
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  Change Password
                </button>
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  Enable Two-Factor Authentication
                </button>
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  View Login History
                </button>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
                Payment & Billing
              </h3>
              <div className="space-y-4">
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  Manage Payment Methods
                </button>
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  View Billing History
                </button>
                <button className="w-full bg-black/30 border border-purple-500/30 hover:border-purple-400 text-white px-4 py-3 rounded-lg font-medium text-left">
                  Subscription Settings
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
                <button className="w-full bg-red-500/20 border border-red-500/30 hover:border-red-400 text-red-400 px-4 py-3 rounded-lg font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 