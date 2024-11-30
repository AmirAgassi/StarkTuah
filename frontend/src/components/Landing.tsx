import React from 'react';

const Landing: React.FC = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white" style={{
      background: 'radial-gradient(circle at bottom, rgba(37, 99, 235, 0.3), rgba(37, 99, 235, 0))',
    }}>
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6">Welcome to StarkTuah</h1>
        <p className="text-xl text-gray-300 mb-8">
          Connect your wallet to access the dashboard and start trading.
        </p>
      </div>
    </div>
    <div className="min-h-screen mx-40 pb-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-300 mt-20">
        Let your money work for you.
      </h1>
      <div className='flex'>
        <div className='bg-[#261a45] w-1/2 p-8 mr-2 rounded-3xl'>
          <h1 className='text-2xl text-[#7c51ed]'>
            Take advantage of StarkNet's scalability
          </h1>
          <p className='text-gray-200 mt-4 text-3xl'>
            StarkNet is a Layer 2 solution for Ethereum that enhances scalability and reduces transaction costs while maintaining Ethereum’s security and decentralization.
          </p>
        </div>
        <div className='bg-[#083a45] w-1/2 p-8 ml-2 rounded-3xl'>
          <h1 className='text-2xl text-[#19b2d4]'>
            Autonomous Algorithmic Trading
          </h1>
          <p className='text-gray-200 mt-4 text-3xl'>
            AI-driven trading strategies that analyze market data and execute trades automatically, optimizing decisions for faster, more reliable profits.
          </p>
        </div>
      </div>
      <div className='flex mt-6'>
        <div className='bg-[#084027] w-1/2 p-8 mr-2 rounded-3xl'>
          <h1 className='text-2xl text-[#15d47f]'>
            Zero-Knowledge Machine Learning (ZKML)
          </h1>
          <p className='text-gray-200 mt-4 text-3xl'>
            ZKML combines machine learning with zero-knowledge proofs to enhance privacy while providing powerful AI-driven insights.
          </p>
        </div>
        <div className='bg-[#420638] w-1/2 p-8 ml-2 rounded-3xl'>
          <h1 className='text-2xl text-[#c910ab]'>
            Fast, Reliable, Secure
          </h1>
          <p className='text-gray-200 mt-4 text-3xl'>
            AI-powered trading offers speed and security, ensuring high-frequency execution and real-time responses to market shifts.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Landing; 