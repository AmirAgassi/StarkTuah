import React from 'react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to StarkTuah</h1>
        <p className="text-xl text-gray-300 mb-8">
          Connect your wallet to access the dashboard and start trading.
        </p>
      </div>
    </div>
  );
};

export default Landing; 