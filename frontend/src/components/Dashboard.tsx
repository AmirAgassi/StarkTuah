import React, { useState } from 'react';
import SwapInterface from './SwapInterface';

type TabType = 'swap' | 'audit';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('swap');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 pt-20">
        {/* main content area with tabs */}
        <div className="flex min-h-[calc(100vh)]">
          {/* vertical tab navigation */}
          <div className="w-48 relative">
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gray-800/50"></div>
            {/* animated background */}
            <div 
              className="absolute w-[calc(100%)] h-10 ml-0 mr-2 rounded-md bg-gray-800/50 transition-transform duration-200"
              style={{ 
                transform: `translateY(${activeTab === 'swap' ? '4px' : '52px'})`,
              }}
            />
            {/* animated indicator */}
            <div 
              className="absolute right-0 w-1 h-10 rounded-full bg-blue-500 transition-transform duration-200"
              style={{ 
                transform: `translateY(${activeTab === 'swap' ? '4px' : '52px'})`,
              }}
            />
            <div className="flex flex-col relative">
              <button
                onClick={() => setActiveTab('swap')}
                className={`h-12 py-3 px-4 text-left font-medium transition-colors duration-200 ${
                  activeTab === 'swap'
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>Swap</span>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`h-12 py-3 px-4 text-left font-medium transition-colors duration-200 ${
                  activeTab === 'audit'
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>Audit</span>
              </button>
            </div>
          </div>

          {/* tab content */}
          <div className="flex-1 pl-8">
            {activeTab === 'swap' && (
              <div>
                <SwapInterface />
              </div>
            )}
            {activeTab === 'audit' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400">Audit section coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;